import envConfig from "@/config";
import { normalizePath } from "@/lib/utils";
import { LoginResType } from "@/schemaValidations/auth.schema";
import { redirect } from "next/navigation";

type CustomOptions = Omit<RequestInit, "method"> & {
  baseUrl?: string | undefined;
};

const ENTITY_ERROR_STATUS = 422;
const AUTHENTICATION_ERROR_STATUS = 401;

type EntityErrorPayload = {
  message: string;
  errors: {
    fields: string;
    message: string;
  }[];
};

export class HttpError extends Error {
  status: number;
  payload: {
    message: string;
    [key: string]: any;
  };
  constructor({ status, payload }: { status: number; payload: any }) {
    super("Http Error");
    this.status = status;
    this.payload = payload;
  }
}

export class EntityError extends HttpError {
  status: number;
  payload: EntityErrorPayload;

  constructor({
    status,
    payload,
  }: {
    status: 422;
    payload: EntityErrorPayload;
  }) {
    super({ status, payload });
    if (status !== ENTITY_ERROR_STATUS) {
      throw new Error(
        `EntityError must have status ${ENTITY_ERROR_STATUS}, but got ${status}`
      );
    }
    this.status = status;
    this.payload = payload;
  }
}

class SessionToken {
  private token = "";
  private _expiresAt = new Date().toISOString();

  get value() {
    return this.token;
  }

  set value(token: string) {
    // Nếu gọi method này ở server thì sẽ bị lỗi.
    if (typeof window === "undefined") {
      throw new Error("Cannot set token on server side");
    }
    this.token = token;
  }

  get expiresAt() {
    return this._expiresAt;
  }

  set expiresAt(expiresAt: string) {
    // Nếu gọi method này ở server thì sẽ bị lỗi.
    if (typeof window === "undefined") {
      throw new Error("Cannot set token on server side");
    }
    this._expiresAt = expiresAt;
  }
}

export const clientSessionToken = new SessionToken();
let clientLogoutRequest: null | Promise<any> = null;

const request = async <Response>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  url: string,
  options?: CustomOptions | undefined
) => {
  const body = options?.body
    ? options.body instanceof FormData
      ? options.body
      : JSON.stringify(options.body)
    : undefined;

  const baseHeaders =
    body instanceof FormData
      ? {
          Authorization: clientSessionToken.value
            ? `Bearer ${clientSessionToken.value}`
            : "",
        }
      : {
          "Content-Type": "application/json",
          Authorization: clientSessionToken.value
            ? `Bearer ${clientSessionToken.value}`
            : "",
        };

  // Nếu không truyền baseUrl (hoặc baseUrl là undefined) thì sẽ lấy từ envConfig.NEXT_PUBLIC_API_ENDPOINT
  // Nếu truyền baseUrl thì sẽ lấy giá trị truyền vào, truyền vào '' thì đồng nghĩa với việc chúng ta gọi API đến Next.js server
  const baseUrl =
    options?.baseUrl === undefined
      ? envConfig.NEXT_PUBLIC_API_ENDPOINT
      : options.baseUrl;

  const fullUrl = url.startsWith("/")
    ? `${baseUrl}${url}`
    : `${baseUrl}/${url}`;

  const res = await fetch(fullUrl, {
    ...options,
    headers: {
      ...baseHeaders,
      ...options?.headers,
    } as any,
    body,
    method,
  });

  const payload: Response = await res.json();

  const data = {
    status: res.status,
    payload,
  };

  if (!res.ok) {
    if (res.status === ENTITY_ERROR_STATUS) {
      throw new EntityError(
        data as {
          status: 422;
          payload: EntityErrorPayload;
        }
      );
    } else if (res.status === AUTHENTICATION_ERROR_STATUS) {
      if (typeof window !== "undefined") {
        if (!clientLogoutRequest) {
          clientLogoutRequest = fetch("/api/auth/logout", {
            method: "POST",
            body: JSON.stringify({ force: true }),
            headers: {
              ...baseHeaders,
            } as any,
          });
          await clientLogoutRequest;
          clientSessionToken.value = "";
          clientLogoutRequest = null;
          clientSessionToken.expiresAt = new Date().toISOString();
          location.href = "/login";
        }
      } else {
        const sessionToken = (options?.headers as any)?.Authorization.split(
          "Bearer "
        )[1];
        redirect(`/logout?sessionToken=${sessionToken}`);
      }
    } else {
      throw new HttpError(data);
    }
  }

  // Đảm bảo logic chỉ chạy ở client side (browser)
  if (typeof window !== "undefined") {
    if (
      ["auth/login", "auth/register"].some(
        (item) => item === normalizePath(url)
      )
    ) {
      clientSessionToken.value = (payload as LoginResType).data.token;
      clientSessionToken.value = (payload as LoginResType).data.expiresAt;
    } else if ("/auth/logout" === normalizePath(url)) {
      clientSessionToken.value = "";
      clientSessionToken.expiresAt = new Date().toISOString();
    }
  }

  return data;
};

const http = {
  get<Response>(
    url: string,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("GET", url, options);
  },

  post<Response>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("POST", url, { ...options, body });
  },

  put<Response>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("PUT", url, { ...options, body });
  },

  delete<Response>(
    url: string,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("DELETE", url, { ...options });
  },
};

export default http;

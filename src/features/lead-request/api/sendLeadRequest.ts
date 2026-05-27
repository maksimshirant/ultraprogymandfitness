const resolveEndpoint = () =>
  import.meta.env.VITE_CONTACT_FORM_ENDPOINT || import.meta.env.VITE_FORMS_ENDPOINT;

export type ContactFormPayload = {
  name: string;
  phone: string;
  topic: string;
  topicValue: string;
  trainer?: string;
  trainerValue?: string;
  question?: string;
  message: string;
  consentToPrivacy: boolean;
  pageUrl?: string;
  submittedAt: string;
  source: string;
};

type SendFormResult = {
  ok: boolean;
  response?: Response;
  data?: Record<string, unknown>;
  error?: string;
  message?: string;
};

const extractResponseData = async (response: Response) => {
  const contentType = response.headers.get('content-type') ?? '';

  if (contentType.includes('application/json')) {
    try {
      return (await response.json()) as Record<string, unknown>;
    } catch {
      return {};
    }
  }

  try {
    const text = await response.text();
    return text ? ({ message: text } as Record<string, unknown>) : {};
  } catch {
    return {};
  }
};

export const sendForm = async (payload: ContactFormPayload): Promise<SendFormResult> => {
  const endpoint = resolveEndpoint();

  if (!endpoint) {
    return {
      ok: false,
      error: 'missing_endpoint',
      message: 'VITE_CONTACT_FORM_ENDPOINT не найден в .env (перезапустите dev-сервер)',
    };
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await extractResponseData(response);

  const success =
    response.ok &&
    (data.success === true || data.ok === true || Object.keys(data).length === 0);

  const message =
    (data?.message as string | undefined) ??
    (data?.error as string | undefined) ??
    (success ? undefined : `HTTP ${response.status}`);

  return {
    ok: success,
    response,
    data,
    message,
    error: success ? undefined : message,
  };
};

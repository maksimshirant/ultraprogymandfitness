const DEFAULT_ENDPOINT = 'https://api.web3forms.com/submit';

const resolveEndpoint = () => import.meta.env.VITE_FORMS_ENDPOINT || DEFAULT_ENDPOINT;

const resolveKey = () => import.meta.env.VITE_WEB3FORMS_KEY;

type SendFormResult = {
  ok: boolean;
  response?: Response;
  data?: Record<string, unknown>;
  error?: string;
  message?: string;
};

export const sendForm = async (formData: FormData): Promise<SendFormResult> => {
  const accessKey = resolveKey();

  if (!accessKey) {
    return {
      ok: false,
      error: 'missing_key',
      message: 'VITE_WEB3FORMS_KEY не найден в .env (перезапустите dev-сервер)',
    };
  }

  if (!formData.has('access_key')) {
    formData.append('access_key', accessKey);
  }

  const endpoint = resolveEndpoint();

  const response = await fetch(endpoint, {
    method: 'POST',
    body: formData,
  });

  let data: Record<string, unknown> = {};
  try {
    data = (await response.json()) as Record<string, unknown>;
  } catch {
    data = {};
  }

  const success = response.ok && (data.success === true || data.ok === true);

  return {
    ok: success,
    response,
    data,
    error: success
      ? undefined
      : ((data?.message as string | undefined) ??
          (data?.error as string | undefined) ??
          `HTTP ${response.status}`),
  };
};

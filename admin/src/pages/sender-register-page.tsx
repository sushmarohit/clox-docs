import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { getErrorDetail, registerSender } from '@/lib/api';
import { fieldClassName, primaryButtonClassName } from '@/components/admin-shell';

type Form = {
  name: string;
  email: string;
  phone: string;
  acceptedTerms: boolean;
};

export function SenderRegisterPage() {
  const navigate = useNavigate();
  const form = useForm<Form>({
    defaultValues: { name: '', email: '', phone: '', acceptedTerms: false },
  });

  const mutation = useMutation({
    mutationFn: (values: Form) =>
      registerSender({
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone.trim() || undefined,
        acceptedTerms: values.acceptedTerms,
      }),
    onSuccess: (_data, values) => {
      navigate('/login', { replace: true, state: { email: values.email.trim().toLowerCase() } });
    },
  });

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-clox-orange">CLOX</p>
        <h1 className="mt-4 text-3xl font-bold">Sender register</h1>
        <p className="mt-2 text-sm text-slate-400">M3 — create account, then OTP login to continue.</p>

        <form
          className="mt-6 space-y-4"
          onSubmit={form.handleSubmit((v) => mutation.mutate(v))}
          noValidate
        >
          <div>
            <label className="mb-1.5 block text-sm">Name</label>
            <input className={fieldClassName} {...form.register('name', { required: true })} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm">Email</label>
            <input
              type="email"
              className={fieldClassName}
              {...form.register('email', { required: true })}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm">Phone (optional)</label>
            <input className={fieldClassName} {...form.register('phone')} />
          </div>
          <label className="flex items-start gap-2 text-sm text-slate-300">
            <input type="checkbox" className="mt-1" {...form.register('acceptedTerms')} />
            I accept Terms & Privacy
          </label>

          {mutation.isError ? (
            <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {getErrorDetail(mutation.error)}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={mutation.isPending || !form.watch('acceptedTerms')}
            className={`${primaryButtonClassName} w-full`}
          >
            {mutation.isPending ? 'Creating…' : 'Create sender account'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-400">
          Already registered?{' '}
          <Link to="/login" className="text-clox-orange hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}

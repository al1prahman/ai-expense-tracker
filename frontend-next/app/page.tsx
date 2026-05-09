import { redirect } from 'next/navigation';

export default function Home() {
  // Langsung arahkan pengguna ke halaman dashboard
  redirect('/dashboard');
}
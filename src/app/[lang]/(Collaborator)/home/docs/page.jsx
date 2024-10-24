'use client'

import { useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { useSession } from 'next-auth/react';
import Swal from 'sweetalert2';

const Page = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    console.log(status)
    console.log(session)

    if (status === 'unauthenticated') {
      Swal.fire({
        title: 'Sesión Expirada',
        text: 'Tu sesión ha expirado, por favor inicia sesión nuevamente.',
        icon: 'warning',
        confirmButtonText: 'Iniciar sesión'
      }).then(() => {
        router.push('/login');
      });
    }
  }, [status, router]);

  return (
    <div>
    </div>
  );
}

export default Page;

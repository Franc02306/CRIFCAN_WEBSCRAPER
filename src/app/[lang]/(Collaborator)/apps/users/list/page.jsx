'use client'

import { useEffect, useState } from 'react'

import UserList from '@views/apps/users/list'
import { listUser } from '../../../../../../Service/userService'

const UserListApp = () => {
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const getListUsers = async () => {
    try {
      const response = await listUser();

      console.log(response.data.results);

      setUsers(response.data.results);
    } catch (error) {
      console.error('Error en la solicitud:', error);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getListUsers();
  }, []);

  const handleUserAdded = async () => {
    await getListUsers(); // Llamada a la API para obtener la lista actualizada
  };

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return <UserList users={users} handleUserAdded={handleUserAdded} />;
}

export default UserListApp

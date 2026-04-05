'use client';

import React, { useEffect, useState } from 'react';
import HttpService from '@services/HttpService';
import { errorAlert, timerAlert } from '@helpers/alerts';
import useStore from '@store/useStore';
import { useRouter } from 'next/navigation';
import logoLogin from '@assets/logo-login.png';
import Spinner from '@admin-shared/spinner/Spinner';
import { getAssetSrc } from '@helpers/assetSrc';
import './page.scss';

export default function Page() {
  const login = useStore((state) => state.login);
  const token = useStore((state) => state.token);
  const httpService = new HttpService();
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [tienda, setTienda] = useState('');
  const [loadingTiendas, setLoadingTiendas] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [tiendas, setTiendas] = useState([]);

  useEffect(() => {
    if (token) {
      router.push('/administracion/dashboard/reportes');
    }
  }, [token, router]);

  useEffect(() => {
    const fetchTiendas = async () => {
      try {
        setLoadingTiendas(true);
        const response = await httpService.getData('/stores');
        if (response.status === 200) {
          setTiendas(response.data);
        } else {
          console.error('Error:', response);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoadingTiendas(false);
      }
    };

    if (!token) {
      fetchTiendas();
    }
  }, [token]);

  if (token) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      username,
      password,
      tienda,
    };

    if (!username || !password || !tienda) {
      errorAlert('Error', 'Por favor completa todos los campos', 2000);
      return;
    }

    handleLogin(data);
  };

  const handleLogin = async (data) => {
    try {
      setSubmitting(true);

      const response = await httpService.postData('/auth/login', data);

      if (response.status === 200) {
        const authToken = response.data.token;
        login(authToken);
        await timerAlert('Bienvenido', 'Acceso exitoso', 2000).then(() => {
          router.push('/administracion/dashboard/reportes');
        });
      } else {
        console.error('Error:', response);
      }
    } catch (error) {
      console.error('Error:', error);
      await errorAlert(
        'Error',
        `${error.response?.data?.message || 'Login failed'}`,
        2000
      ).then(() => {
        setUsername('');
        setPassword('');
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="main_container_login">
      <div className="container_login">
        <div className="left_block_login">
          <div className="left_block_login_container">
            <div className="left_block_brand">
              <img src={getAssetSrc(logoLogin)} alt="Logo" className="logo_login" />
              <h1 className="title_login">Administracion</h1>
            </div>

            <div className="left_block_greeting">
              <h2 className="greeting_login">Bienvenido</h2>
            </div>

            <div className="left_block_form">
              <form className="form_login" onSubmit={handleSubmit}>
                <div className="input_group">
                  <label htmlFor="username" className="label label_email">
                    Username
                  </label>
                  <input
                    type="text"
                    className="input_text"
                    id="username"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>

                <div className="input_group">
                  <label htmlFor="password" className="label label_pass">
                    Password
                  </label>
                  <input
                    type="password"
                    className="input_text"
                    id="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div className="input_group">
                  <label htmlFor="tienda" className="label label_tienda">
                    Tienda
                  </label>
                  <select
                    className="input_select"
                    id="tienda"
                    required
                    value={tienda}
                    disabled={loadingTiendas}
                    onChange={(e) => setTienda(e.target.value)}
                  >
                    <option value="" disabled>
                      {loadingTiendas ? 'Cargando tiendas...' : 'Seleccionar tienda'}
                    </option>
                    {tiendas.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>

                {submitting ? (
                  <div className="spinner_container">
                    <Spinner />
                  </div>
                ) : (
                  <button type="submit" className="login_submit_btn" disabled={loadingTiendas}>
                    Iniciar sesion
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>

        <div className="right_block_login">
          <div className="right_block_login_container">
            <img src={getAssetSrc(logoLogin)} alt="Logo" className="logo_login" />
          </div>
        </div>
      </div>
    </div>
  );
}

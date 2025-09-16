import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const success = await login(password);
      if (success) {
        navigate('/admin/panel');
      } else {
        setError('Senha incorreta.');
      }
    } catch (error) {
      setError('Erro ao fazer login. Tente novamente.');
      console.error('Erro no login:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Acesso Administrativo</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="password">Senha de Administrador</label>
            <input 
              id="password"
              type='password' 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              placeholder='Digite a senha' 
              required
              disabled={isLoading}
              aria-describedby={error ? "password-error" : undefined}
            />
            {error && <div id="password-error" className="error-message">{error}</div>}
          </div>
          <button 
            type='submit' 
            disabled={isLoading || !password.trim()}
            className="login-button"
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        <div className="login-footer">
          <a href="/" className="back-link">← Voltar ao formulário</a>
        </div>
      </div>
    </div>
  );
}

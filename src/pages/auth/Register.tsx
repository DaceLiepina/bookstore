import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useAppSelector } from '../../app/hooks';

import {
  Person,
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  HowToReg,
  ErrorOutline,
  ArrowBack,
} from '@mui/icons-material';

import {
  TextField,
  IconButton,
  InputAdornment,
  OutlinedInput,
  FormControl,
  InputLabel,
  Button,
} from '@mui/material';

import { translations } from '../../features/language/translations';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuth();
  const currentLanguage = useAppSelector(
    (state) => state.language.currentLanguage
  );
  // const { translationsAuth } = useAppSelector((state) => state.language); 
  const t = translations[currentLanguage].auth.register;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formError, setFormError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    clearError();
    setFormError('');

    if (field === 'password') calculatePasswordStrength(value);
  };

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    setPasswordStrength(strength);
  };

  const getStrengthColor = () => {
    if (passwordStrength >= 75) return 'var(--success)'; // Strong
    if (passwordStrength >= 50) return 'var(--warning)'; // Medium
    if (passwordStrength >= 25) return 'var(--accent)'; // Weak
    return 'var(--danger)'; // Very Weak
  };

  const validateForm = (): boolean => {
    clearError();
    setFormError('');

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setFormError(t.errors.fillAllFields);
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setFormError(t.errors.validEmail);
      return false;
    }

    if (formData.password.length < 6) {
      setFormError(t.errors.passwordLength);
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setFormError(t.errors.passwordsMatch);
      return false;
    }

    if (!agreedToTerms) {
      setFormError(t.errors.agreeToTerms);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const success = await register(
      formData.email,
      formData.password,
      formData.name
    );
    if (success) navigate('/dashboard', { replace: true });
  };

  return (
    <div className='min-h-screen flex items-center justify-center text-gray-700 dark:bg-gray-900 dark:text-gray-400 py-12 px-4'>
      <div className='relative max-w-2xl w-full space-y-8 bg-linear-to-r from-gray-100 to-blue-900/20 text-gray-900 dark:from-gray-800 dark:to-blue-950 dark:text-gray-400 rounded-2xl shadow-xl p-8'>
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className='absolute left-6 top-6 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors'
        >
          <ArrowBack />
          <span>{t.back}</span>
        </button>

        {/* Header */}
        <div className='text-center'>
          <div className='mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4 shadow-md'>
            <HowToReg className='w-8 h-8 text-gray-700 dark:text-gray-300' />{' '}
          </div>

          <h2 className='text-3xl font-bold'>{t.title}</h2>
          <p className='mt-2 text-muted-foreground'>{t.subtitle}</p>
        </div>

        {/* Form */}
        <form className='space-y-6' onSubmit={handleSubmit}>
          {/* Full Name */}
          <div>
            <TextField
              label={t.nameLabel}
              fullWidth
              value={formData.name}
              onChange={(e) => updateFormData('name', e.target.value)}
              disabled={isLoading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <Person sx={{ color: 'var(--muted-foreground)' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'var(--foreground)',
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'var(--border)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'var(--primary)',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'var(--primary)',
                },
                '& .MuiInputLabel-root': {
                  color: 'var(--muted-foreground)',
                },
              }}
            />
          </div>
          {/* Email */}
          <div>
            <TextField
              label={t.emailLabel}
              className='mb-1'
              fullWidth
              value={formData.email}
              onChange={(e) => updateFormData('email', e.target.value)}
              disabled={isLoading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <Email sx={{ color: 'var(--muted-foreground)' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': { color: 'var(--foreground)' },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'var(--border)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'var(--primary)',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'var(--primary)',
                },
                '& .MuiInputLabel-root': { color: 'var(--muted-foreground)' },
              }}
            />
          </div>
          {/* Password */}
          <FormControl fullWidth variant='outlined'>
            <InputLabel sx={{ color: 'var(--muted-foreground)' }}>
              {t.passwordLabel}
            </InputLabel>

            <OutlinedInput
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => updateFormData('password', e.target.value)}
              disabled={isLoading}
              startAdornment={
                <InputAdornment position='start'>
                  <Lock sx={{ color: 'var(--muted-foreground)' }} />
                </InputAdornment>
              }
              endAdornment={
                <InputAdornment position='end'>
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? (
                      <VisibilityOff
                        sx={{ color: 'var(--muted-foreground)' }}
                      />
                    ) : (
                      <Visibility sx={{ color: 'var(--muted-foreground)' }} />
                    )}
                  </IconButton>
                </InputAdornment>
              }
              label={t.passwordLabel}
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'var(--border)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'var(--primary)',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'var(--primary)',
                },
                color: 'var(--foreground)',
              }}
            />
          </FormControl>

          {/* Password Strength Meter */}
          {formData.password && (
            <div className='space-y-3'>
              <div className='flex justify-between text-sm'>
                <span className='text-muted-foreground'>
                  {t.passwordStrength}
                </span>
                <span
                  className='font-medium'
                  style={{ color: getStrengthColor() }}
                >
                  {passwordStrength >= 75
                    ? t.strength.strong
                    : passwordStrength >= 50
                    ? t.strength.medium
                    : t.strength.weak}
                </span>
              </div>

              <div
                className='h-2 rounded-lg overflow-hidden'
                style={{ background: 'var(--border)' }}
              >
                <div
                  className='h-full transition-all duration-300'
                  style={{
                    width: `${passwordStrength}%`,
                    background: getStrengthColor(),
                  }}
                />
              </div>
            </div>
          )}

          {/* Confirm Password */}
          <FormControl fullWidth variant='outlined'>
            <InputLabel sx={{ color: 'var(--muted-foreground)' }}>
              {t.confirmPasswordLabel}
            </InputLabel>

            <OutlinedInput
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              disabled={isLoading}
              onChange={(e) =>
                updateFormData('confirmPassword', e.target.value)
              }
              startAdornment={
                <InputAdornment position='start'>
                  <Lock sx={{ color: 'var(--muted-foreground)' }} />
                </InputAdornment>
              }
              endAdornment={
                <InputAdornment position='end'>
                  <IconButton
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                  >
                    {showConfirmPassword ? (
                      <VisibilityOff
                        sx={{ color: 'var(--muted-foreground)' }}
                      />
                    ) : (
                      <Visibility sx={{ color: 'var(--muted-foreground)' }} />
                    )}
                  </IconButton>
                </InputAdornment>
              }
              label={t.confirmPasswordLabel}
              sx={{
                mb: 2,
                color: 'var(--foreground)',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'var(--border)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'var(--primary)',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'var(--primary)',
                },
              }}
            />
          </FormControl>

          {/* Terms */}
          <div className='flex items-start gap-2'>
            <input
              type='checkbox'
              className='mt-1 h-4 w-4 text-primary border-border rounded'
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
            />
            <p className='text-sm text-muted-foreground'>
              {t.agreeTo}{' '}
              <Link to='/terms' className='text-primary hover:underline'>
                {t.termsLink}
              </Link>{' '}
              {t.and}{' '}
              <Link to='/privacy' className='text-primary hover:underline'>
                {t.privacyLink}
              </Link>
            </p>
          </div>

          {/* Errors */}
          {(error || formError) && (
            <div className='flex items-center gap-2 p-3 rounded-lg bg-red-500/10 text-red-600 border border-red-500/30 text-sm'>
              <ErrorOutline />
              <span>{error || formError}</span>
            </div>
          )}

          {/* Submit */}
          <Button
            type='submit'
            fullWidth
            disabled={isLoading || !agreedToTerms}
            sx={{
              py: 1.6,
              fontSize: '1rem',
              fontWeight: 600,
              textTransform: 'none',
              backgroundColor: 'var(--primary)',
              color: 'var(--foreground)',
              '&:hover': {
                backgroundColor: 'var(--accent)',
              },
              borderRadius: '0.75rem',
            }}
          >
            {isLoading ? t.registerButtonLoading : t.registerButton}
          </Button>
        </form>

        {/* Footer */}
        <div className='text-center'>
          <p className='text-muted-foreground'>
            {t.loginPrompt}{' '}
            <Link to='/login' className='text-primary hover:underline'>
              {t.loginLink}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

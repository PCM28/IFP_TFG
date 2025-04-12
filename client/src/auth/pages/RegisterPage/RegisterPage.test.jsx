import { describe, test, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import { RegisterPage } from './RegisterPage';
import axios from 'axios';

// Mock axios
vi.mock('axios');


// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate
    };
});

// Crear un mock del store con estado más completo
const mockStore = configureStore({
    reducer: {
        auth: (state = { user: null, error: null, isLoading: false }, action) => {
            if (action.type === 'REGISTER_USER_ERROR') {
                return { ...state, error: action.payload };
            }
            return state;
        }
    }
});

const renderWithProviders = (component) => {
    return render(
        <Provider store={mockStore}>
            <MemoryRouter>
                {component}
            </MemoryRouter>
        </Provider>
    );
};

describe('Registro de Usuario - Tests Unitarios', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        renderWithProviders(<RegisterPage />);
    });

    test('no permite enviar el formulario si el campo nombre está vacío', () => {
        const nameInput = screen.getByPlaceholderText('Nombre completo');
        expect(nameInput.validity.valid).toBe(false);
    });

    test('muestra error si la edad es menor a 13', () => {
        const ageInput = screen.getByPlaceholderText('Edad');
        fireEvent.change(ageInput, { target: { value: '12' } });
        expect(ageInput.validity.valid).toBe(false);
    });

    test('no permite enviar el formulario si el formato del email es inválido', () => {
        const emailInput = screen.getByPlaceholderText('Correo');
        fireEvent.change(emailInput, { target: { value: 'emailinvalido' } });
        expect(emailInput.validity.valid).toBe(false);
    });
});

describe('Registro de Usuario - Tests de Integración', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('proceso completo de registro de usuario', async () => {
        renderWithProviders(<RegisterPage />);

        fireEvent.change(screen.getByPlaceholderText('Nombre completo'), {
            target: { value: 'Usuario Test' }
        });
        fireEvent.change(screen.getByPlaceholderText('Edad'), {
            target: { value: '25' }
        });
        fireEvent.change(screen.getByPlaceholderText('País'), {
            target: { value: 'España' }
        });
        fireEvent.change(screen.getByPlaceholderText('Correo'), {
            target: { value: 'test@example.com' }
        });
        fireEvent.change(screen.getByPlaceholderText('Contraseña'), {
            target: { value: 'password123' }
        });

        axios.post.mockResolvedValueOnce({
            data: {
                _id: '123',
                name: 'Usuario Test',
                email: 'test@example.com',
                age: '25',
                country: 'España'
            }
        });

        fireEvent.click(screen.getByText('Crear Cuenta'));

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith(
                'http://localhost:5000/users/register',
                expect.any(FormData),
                expect.any(Object)
            );
        });

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/auth/login');
        });
    });

    test('manejo de errores en el registro', async () => {
        renderWithProviders(<RegisterPage />);

        fireEvent.change(screen.getByPlaceholderText('Nombre completo'), {
            target: { value: 'Usuario Test' }
        });
        fireEvent.change(screen.getByPlaceholderText('Edad'), {
            target: { value: '25' }
        });
        fireEvent.change(screen.getByPlaceholderText('País'), {
            target: { value: 'España' }
        });
        fireEvent.change(screen.getByPlaceholderText('Correo'), {
            target: { value: 'existente@example.com' }
        });
        fireEvent.change(screen.getByPlaceholderText('Contraseña'), {
            target: { value: 'password123' }
        });

        const errorMessage = 'Este email ya está registrado';
        axios.post.mockRejectedValueOnce({
            response: {
                data: {
                    message: errorMessage
                }
            }
        });

        fireEvent.click(screen.getByText('Crear Cuenta'));

        await waitFor(() => {
            const state = mockStore.getState();
            expect(state.auth.error).toBe(errorMessage);
            
            const errorElement = screen.getByRole('heading', { level: 2, class: 'error' });
            expect(errorElement).toHaveTextContent(errorMessage);
        });
    });
});

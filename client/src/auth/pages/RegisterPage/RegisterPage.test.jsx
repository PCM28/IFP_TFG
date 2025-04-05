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

describe('Registro de Usuario - Test de Integración', () => {
    beforeEach(() => {
        // Limpiar todos los mocks antes de cada test
        vi.clearAllMocks();
    });

    test('proceso completo de registro de usuario', async () => {
        // 1. Renderizar el componente
        renderWithProviders(<RegisterPage />);

        // 2. Simular el llenado del formulario
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

        // 3. Mock de la respuesta del servidor
        axios.post.mockResolvedValueOnce({
            data: {
                _id: '123',
                name: 'Usuario Test',
                email: 'test@example.com',
                age: '25',
                country: 'España'
            }
        });

        // 4. Simular el envío del formulario
        fireEvent.click(screen.getByText('Crear Cuenta'));

        // 5. Verificar que se hizo la llamada al endpoint correcto
        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith(
                'http://localhost:5000/users/register',
                expect.any(FormData),
                expect.any(Object)
            );
        });

        // 6. Verificar que se llamó a navigate con la ruta correcta
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/auth/login');
        });
    });

    test('manejo de errores en el registro', async () => {
        // 1. Renderizar el componente
        renderWithProviders(<RegisterPage />);

        // 2. Simular el llenado del formulario con email que ya existe
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

        // 3. Mock de error del servidor
        const errorMessage = 'Este email ya está registrado';
        axios.post.mockRejectedValueOnce({
            response: {
                data: {
                    message: errorMessage
                }
            }
        });

        // 4. Simular el envío del formulario
        fireEvent.click(screen.getByText('Crear Cuenta'));

        // 5. Verificar que se muestra el mensaje de error
        await waitFor(() => {
            // Primero verificamos que el error se haya actualizado en el store
            const state = mockStore.getState();
            expect(state.auth.error).toBe(errorMessage);
            
            // Luego verificamos que el error se muestre en el DOM
            const errorElement = screen.getByRole('heading', { level: 2, class: 'error' });
            expect(errorElement).toHaveTextContent(errorMessage);
        });
    });
});

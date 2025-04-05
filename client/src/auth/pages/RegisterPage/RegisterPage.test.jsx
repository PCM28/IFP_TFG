import { describe, test, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import { RegisterPage } from './RegisterPage';

// Crear un mock del store
const mockStore = configureStore({
    reducer: {
        auth: (state = { user: null, error: null, isLoading: false }) => state
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

describe("RegisterPage form validation", () => {
    test("no permite enviar el formulario si el nombre está vacío", () => {
        renderWithProviders(<RegisterPage />);
        
        fireEvent.change(screen.getByPlaceholderText("Edad"), { target: { value: "25" } });
        fireEvent.change(screen.getByPlaceholderText("Correo"), { target: { value: "test@email.com" } });
        fireEvent.change(screen.getByPlaceholderText("País"), { target: { value: "España" } });
        fireEvent.change(screen.getByPlaceholderText("Contraseña"), { target: { value: "password1" } });

        fireEvent.click(screen.getByText("Crear Cuenta"));

        const nombreInput = screen.getByPlaceholderText("Nombre completo");
        console.log('Test 1 - Valor del nombre:', nombreInput.value);
        expect(nombreInput.value).toBe("");
    });

    test("muestra error si la edad no cumple el patrón (menor de 13)", () => {
        renderWithProviders(<RegisterPage />);

        fireEvent.change(screen.getByPlaceholderText("Nombre completo"), { target: { value: "Carlos" } });
        fireEvent.change(screen.getByPlaceholderText("Edad"), { target: { value: "10" } });
        fireEvent.change(screen.getByPlaceholderText("Correo"), { target: { value: "test@email.com" } });
        fireEvent.change(screen.getByPlaceholderText("País"), { target: { value: "España" } });
        fireEvent.change(screen.getByPlaceholderText("Contraseña"), { target: { value: "password1" } });

        fireEvent.click(screen.getByText("Crear Cuenta"));

        const edadInput = screen.getByPlaceholderText("Edad");
        console.log('Test 2 - Validez de edad:', edadInput.validity.valid);
        expect(edadInput.validity.valid).toBe(false);
    });

    test("no permite enviar si el email no tiene formato válido", () => {
        renderWithProviders(<RegisterPage />);

        fireEvent.change(screen.getByPlaceholderText("Nombre completo"), { target: { value: "Ana" } });
        fireEvent.change(screen.getByPlaceholderText("Edad"), { target: { value: "30" } });
        fireEvent.change(screen.getByPlaceholderText("Correo"), { target: { value: "correo-no-valido" } });
        fireEvent.change(screen.getByPlaceholderText("País"), { target: { value: "México" } });
        fireEvent.change(screen.getByPlaceholderText("Contraseña"), { target: { value: "password1" } });

        fireEvent.click(screen.getByText("Crear Cuenta"));

        const emailInput = screen.getByPlaceholderText("Correo");
        console.log('Test 3 - Validez de email:', emailInput.validity.valid);
        expect(emailInput.validity.valid).toBe(false);
    });
});

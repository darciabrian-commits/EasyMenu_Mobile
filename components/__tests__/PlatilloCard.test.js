import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import PlatilloCard from '../PlatilloCard';

describe('PlatilloCard de EasyMenu', () => {

  test('muestra datos y permite editar', async () => {
    const onEdit = jest.fn();
    const onDelete = jest.fn();

    const item = {
      id: 7,
      nombre: 'Pupusa QA',
      precio: 2.50
    };

    // Renderizar el componente y esperar el resultado
    const { getByText } = await render(
      <PlatilloCard
        item={item}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );

    // Verificar que el nombre aparece en pantalla
    expect(getByText('Pupusa QA')).toBeTruthy();

    // Simular la pulsación del botón Editar
    await fireEvent.press(getByText('Editar'));

    // Comprobar que se envió el producto correcto
    expect(onEdit).toHaveBeenCalledWith(item);

    // Comprobar que no se llamó a eliminar
    expect(onDelete).not.toHaveBeenCalled();
  });

  test('permite solicitar eliminación del producto', async () => {
    const onEdit = jest.fn();
    const onDelete = jest.fn();

    const item = {
      id: 9,
      nombre: 'Bebida QA',
      precio: 1
    };

    // Renderizar el componente
    const { getByText } = await render(
      <PlatilloCard
        item={item}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );

    // Verificar que aparece el producto
    expect(getByText('Bebida QA')).toBeTruthy();

    // Simular la pulsación del botón Borrar
    await fireEvent.press(getByText('Borrar'));

    // Verificar que se envió el ID correcto
    expect(onDelete).toHaveBeenCalledWith(9);

    // Verificar que no se llamó a editar
    expect(onEdit).not.toHaveBeenCalled();
  });

});
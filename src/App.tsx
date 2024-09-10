import { useState, useEffect } from 'react';
import Draggable from 'react-draggable'; // Importa react-draggable
import './App.css';

interface Mesa {
  id: string;
  label: string;
  emUso: boolean; // Estado de uso da mesa (true = em uso, false = livre)
  area: string; // Propriedade que identifica a área onde a mesa está
  x: number; // Posição horizontal da mesa
  y: number; // Posição vertical da mesa
}

function App() {
  const [mesas, setMesas] = useState<Mesa[]>(() => {
    const savedMesas = localStorage.getItem('mesas');
    return savedMesas
      ? JSON.parse(savedMesas)
      : [
          { id: 'mesa-1', label: 'Mesa 1', emUso: false, area: 'area-1', x: 0, y: 0 },
          { id: 'mesa-2', label: 'Mesa 2', emUso: false, area: 'area-1', x: 0, y: 0 },
          { id: 'mesa-3', label: 'Mesa 3', emUso: false, area: 'area-2', x: 0, y: 0 },
          { id: 'mesa-4', label: 'Mesa 4', emUso: false, area: 'area-2', x: 0, y: 0 },
          { id: 'mesa-5', label: 'Mesa 5', emUso: false, area: 'area-3', x: 0, y: 0 },
          { id: 'mesa-6', label: 'Mesa 6', emUso: false, area: 'area-3', x: 0, y: 0 },
        ];
  });

  const [mesaSelecionada, setMesaSelecionada] = useState<{ [key: string]: string }>({
    'area-1': '',
    'area-2': '',
    'area-3': ''
  });

  useEffect(() => {
    localStorage.setItem('mesas', JSON.stringify(mesas));
  }, [mesas]);

  // Função para alternar o status de uso da mesa
  const toggleUsoMesa = (id: string) => {
    setMesas((prevMesas) =>
      prevMesas.map((mesa) =>
        mesa.id === id ? { ...mesa, emUso: !mesa.emUso } : mesa
      )
    );
  };

  // Função para criar uma nova mesa em uma área específica
  const criarMesa = (area: string) => {
    const novaMesa: Mesa = {
      id: `mesa-${mesas.length + 1}`,
      label: `Mesa ${mesas.length + 1}`,
      emUso: false,
      area: area,
      x: 0,
      y: 0,
    };
    setMesas((prevMesas) => [...prevMesas, novaMesa]);
  };

  // Função para remover uma mesa específica
  const removerMesaPorId = (id: string) => {
    setMesas((prevMesas) => prevMesas.filter((mesa) => mesa.id !== id));
  };

  // Função para lidar com a seleção de qual mesa apagar
  const handleRemoverMesa = (area: string) => {
    if (mesaSelecionada[area]) {
      removerMesaPorId(mesaSelecionada[area]);
      setMesaSelecionada((prevSelecionada) => ({ ...prevSelecionada, [area]: '' }));
    }
  };

  // Função para atualizar a posição da mesa ao parar de arrastar
  const handleStop = (e: any, data: any, mesaId: string) => {
    setMesas((prevMesas) =>
      prevMesas.map((mesa) =>
        mesa.id === mesaId ? { ...mesa, x: data.x, y: data.y } : mesa
      )
    );
  };

  return (
    <>
      <div className="container">
        <h1>Layout do Restaurante</h1>

        <div className="layout">
          {/* Área 1 */}
          <div className="area" id="area-1">
            <h2>Área 1</h2>
            <button onClick={() => criarMesa('area-1')}>Adicionar Mesa</button>

            <div>
              <select
                value={mesaSelecionada['area-1']}
                onChange={(e) =>
                  setMesaSelecionada({ ...mesaSelecionada, 'area-1': e.target.value })
                }
              >
                <option value="">Selecione uma mesa</option>
                {mesas
                  .filter((mesa) => mesa.area === 'area-1')
                  .map((mesa) => (
                    <option key={mesa.id} value={mesa.id}>
                      {mesa.label}
                    </option>
                  ))}
              </select>
              <button onClick={() => handleRemoverMesa('area-1')}>Remover Mesa</button>
            </div>

            {mesas
              .filter((mesa) => mesa.area === 'area-1')
              .map((mesa) => (
                <Draggable
                  key={mesa.id}
                  bounds="parent"
                  position={{ x: mesa.x, y: mesa.y }}
                  onStop={(e, data) => handleStop(e, data, mesa.id)}
                >
                  <div
                    className="mesa"
                    onClick={() => toggleUsoMesa(mesa.id)}
                    style={{
                      backgroundColor: mesa.emUso ? '#f44336' : '#4caf50',
                    }}
                  >
                    {mesa.label}
                  </div>
                </Draggable>
              ))}
          </div>

          {/* Área 2 */}
          <div className="area" id="area-2">
            <h2>Área 2</h2>
            <button onClick={() => criarMesa('area-2')}>Adicionar Mesa</button>

            <div>
              <select
                value={mesaSelecionada['area-2']}
                onChange={(e) =>
                  setMesaSelecionada({ ...mesaSelecionada, 'area-2': e.target.value })
                }
              >
                <option value="">Selecione uma mesa</option>
                {mesas
                  .filter((mesa) => mesa.area === 'area-2')
                  .map((mesa) => (
                    <option key={mesa.id} value={mesa.id}>
                      {mesa.label}
                    </option>
                  ))}
              </select>
              <button onClick={() => handleRemoverMesa('area-2')}>Remover Mesa</button>
            </div>

            {mesas
              .filter((mesa) => mesa.area === 'area-2')
              .map((mesa) => (
                <Draggable
                  key={mesa.id}
                  bounds="parent"
                  position={{ x: mesa.x, y: mesa.y }}
                  onStop={(e, data) => handleStop(e, data, mesa.id)}
                >
                  <div
                    className="mesa"
                    onClick={() => toggleUsoMesa(mesa.id)}
                    style={{
                      backgroundColor: mesa.emUso ? '#f44336' : '#4caf50',
                    }}
                  >
                    {mesa.label}
                  </div>
                </Draggable>
              ))}
          </div>

          {/* Área 3 */}
          <div className="area" id="area-3">
            <h2>Área 3</h2>
            <button onClick={() => criarMesa('area-3')}>Adicionar Mesa</button>

            <div>
              <select
                value={mesaSelecionada['area-3']}
                onChange={(e) =>
                  setMesaSelecionada({ ...mesaSelecionada, 'area-3': e.target.value })
                }
              >
                <option value="">Selecione uma mesa</option>
                {mesas
                  .filter((mesa) => mesa.area === 'area-3')
                  .map((mesa) => (
                    <option key={mesa.id} value={mesa.id}>
                      {mesa.label}
                    </option>
                  ))}
              </select>
              <button onClick={() => handleRemoverMesa('area-3')}>Remover Mesa</button>
            </div>

            {mesas
              .filter((mesa) => mesa.area === 'area-3')
              .map((mesa) => (
                <Draggable
                  key={mesa.id}
                  bounds="parent"
                  position={{ x: mesa.x, y: mesa.y }}
                  onStop={(e, data) => handleStop(e, data, mesa.id)}
                >
                  <div
                    className="mesa"
                    onClick={() => toggleUsoMesa(mesa.id)}
                    style={{
                      backgroundColor: mesa.emUso ? '#f44336' : '#4caf50',
                    }}
                  >
                    {mesa.label}
                  </div>
                </Draggable>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;

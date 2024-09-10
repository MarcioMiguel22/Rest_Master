import { useState, useEffect } from 'react';
import Draggable, { DraggableEvent, DraggableData } from 'react-draggable'; // Importa react-draggable
import './App.css';

interface Mesa {
  id: string;
  label: string;
  emUso: boolean; // Estado de uso da mesa (true = em uso, false = livre)
  area: string; // Propriedade que identifica a área onde a mesa está
  x: number; // Posição horizontal da mesa
  y: number; // Posição vertical da mesa
}

interface Reserva {
  mesaId: string;
  nome: string;
  telefone: string;
  email: string;
  inicio: string;
  fim: string;
  status: 'reservado' | 'cancelado';
  transferirParaMesa?: string;
  dataReserva: string; // Novo campo para a data em que o cliente quer reservar
  dataRegistro: string; // Novo campo para a data em que a reserva foi registrada
}

function App() {
  // Estado das mesas
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

  // Estado para fixar/desfixar as mesas
  const [mesasFixas, setMesasFixas] = useState(false);

  // Estado para o histórico de reservas
  const [historicoReservas, setHistoricoReservas] = useState<Reserva[]>(() => {
    const savedHistorico = localStorage.getItem('historicoReservas');
    return savedHistorico ? JSON.parse(savedHistorico) : [];
  });

  // Estado da mesa selecionada
  const [mesaSelecionada, setMesaSelecionada] = useState<{ [key: string]: string }>({
    'area-1': '',
    'area-2': '',
    'area-3': '',
  });

  // Estado para mostrar ou esconder o formulário
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  // Estado para armazenar os dados da reserva
  const [reserva, setReserva] = useState<Reserva>({
    mesaId: '',
    nome: '',
    telefone: '',
    email: '',
    inicio: '',
    fim: '',
    status: 'reservado',
    transferirParaMesa: '',
    dataReserva: '',
    dataRegistro: '',
  });

  // Salva as mesas no local storage sempre que o estado das mesas muda
  useEffect(() => {
    localStorage.setItem('mesas', JSON.stringify(mesas));
  }, [mesas]);

  // Salva o histórico de reservas no local storage sempre que ele for atualizado
  useEffect(() => {
    localStorage.setItem('historicoReservas', JSON.stringify(historicoReservas));
  }, [historicoReservas]);

  // Função para alternar o estado de uso da mesa
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

  // Função para lidar com a remoção de mesa
  const handleRemoverMesa = (area: string) => {
    if (mesaSelecionada[area]) {
      removerMesaPorId(mesaSelecionada[area]);
      setMesaSelecionada((prevSelecionada) => ({ ...prevSelecionada, [area]: '' }));
    }
  };

  // Função para atualizar a posição da mesa ao soltar o arraste
  const handleStop = (_: DraggableEvent, data: DraggableData, mesaId: string) => {
    setMesas((prevMesas) =>
      prevMesas.map((mesa) =>
        mesa.id === mesaId ? { ...mesa, x: data.x, y: data.y } : mesa
      )
    );
  };

  // Função para lidar com as mudanças no formulário de reserva
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setReserva((prev) => ({ ...prev, [name]: value }));
  };

  // Função para salvar a reserva e adicionar ao histórico
  const handleSubmit = () => {
    // Adiciona a data do registro no momento da reserva
    const dataRegistroAtual = new Date().toLocaleDateString('pt-BR');

    const novaReserva = { ...reserva, dataRegistro: dataRegistroAtual };

    // Adiciona a reserva atual ao histórico de reservas
    setHistoricoReservas((prevHistorico) => [...prevHistorico, novaReserva]);

    // Atualiza a mesa correspondente para em uso
    toggleUsoMesa(reserva.mesaId);

    setMostrarFormulario(false); // Fecha o formulário após o envio
  };

  // Função para alternar entre fixar e liberar as mesas
  const toggleFixarMesas = () => {
    setMesasFixas(!mesasFixas);
  };

  return (
    <>
      <div className="container">
        <h1>Layout do Restaurante</h1>

        <div className="layout">
          <button
            onClick={() => setMostrarFormulario(true)}
            className="fixed bottom-10 right-10 bg-blue-500 text-white p-3 rounded-full"
          >
            Nova Reserva
          </button>

          {/* Botão para alternar fixar/desfixar as mesas */}
          <button
            onClick={toggleFixarMesas}
            className="fixed bottom-20 right-10 bg-gray-500 text-white p-3 rounded-full"
          >
            {mesasFixas ? 'Liberar Mesas' : 'Fixar Mesas'}
          </button>

          {mostrarFormulario && (
            <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                <h2 className="text-xl mb-4">Fazer Reserva</h2>

                <form className="space-y-4">
                  <div>
                    <label htmlFor="mesaId" className="block text-sm font-medium">
                      Mesa Número
                    </label>
                    <input
                      id="mesaId"
                      name="mesaId"
                      value={reserva.mesaId}
                      onChange={handleInputChange}
                      type="text"
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                  </div>

                  <div>
                    <label htmlFor="nome" className="block text-sm font-medium">
                      Nome
                    </label>
                    <input
                      id="nome"
                      name="nome"
                      value={reserva.nome}
                      onChange={handleInputChange}
                      type="text"
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                  </div>

                  <div>
                    <label htmlFor="telefone" className="block text-sm font-medium">
                      Telefone
                    </label>
                    <input
                      id="telefone"
                      name="telefone"
                      value={reserva.telefone}
                      onChange={handleInputChange}
                      type="tel"
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium">
                      E-mail
                    </label>
                    <input
                      id="email"
                      name="email"
                      value={reserva.email}
                      onChange={handleInputChange}
                      type="email"
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                  </div>

                  <div>
                    <label htmlFor="inicio" className="block text-sm font-medium">
                      Hora de Início
                    </label>
                    <input
                      id="inicio"
                      name="inicio"
                      value={reserva.inicio}
                      onChange={handleInputChange}
                      type="time"
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                  </div>

                  <div>
                    <label htmlFor="fim" className="block text-sm font-medium">
                      Hora de Fim
                    </label>
                    <input
                      id="fim"
                      name="fim"
                      value={reserva.fim}
                      onChange={handleInputChange}
                      type="time"
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                  </div>

                  <div>
                    <label htmlFor="dataReserva" className="block text-sm font-medium">
                      Data da Reserva
                    </label>
                    <input
                      id="dataReserva"
                      name="dataReserva"
                      value={reserva.dataReserva}
                      onChange={handleInputChange}
                      type="date"
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                  </div>

                  <div>
                    <label htmlFor="status" className="block text-sm font-medium">
                      Status da Reserva
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={reserva.status}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    >
                      <option value="reservado">Reservado</option>
                      <option value="cancelado">Cancelado</option>
                    </select>
                  </div>

                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => setMostrarFormulario(false)}
                      className="bg-red-500 text-white px-4 py-2 rounded-md"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="bg-green-500 text-white px-4 py-2 rounded-md"
                    >
                      Salvar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Renderização das áreas e mesas */}
          {['area-1', 'area-2', 'area-3'].map((area) => (
            <div className="area" key={area} id={area}>
              <h2>{`Área ${area.split('-')[1]}`}</h2>
              <button onClick={() => criarMesa(area)}>Adicionar Mesa</button>

              <div>
                <select
                  value={mesaSelecionada[area]}
                  onChange={(e) =>
                    setMesaSelecionada({ ...mesaSelecionada, [area]: e.target.value })
                  }
                >
                  <option value="">Selecione uma mesa</option>
                  {mesas
                    .filter((mesa) => mesa.area === area)
                    .map((mesa) => (
                      <option key={mesa.id} value={mesa.id}>
                        {mesa.label}
                      </option>
                    ))}
                </select>
                <button onClick={() => handleRemoverMesa(area)}>Remover Mesa</button>
              </div>

              {mesas
                .filter((mesa) => mesa.area === area)
                .map((mesa) => (
                  <Draggable
                    key={mesa.id}
                    bounds="parent"
                    position={{ x: mesa.x, y: mesa.y }}
                    onStop={(e, data) => handleStop(e, data, mesa.id)}
                    disabled={mesasFixas} // Desativa o arraste se mesasFixas for true
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
          ))}

          {/* Exibição do histórico de reservas */}
          <div className="historico mt-10">
            <h2>Histórico de Reservas</h2>
            <ul>
              {historicoReservas.map((reserva, index) => (
                <li key={index}>
                  Mesa: {reserva.mesaId}, Nome: {reserva.nome}, Telefone: {reserva.telefone},
                  Status: {reserva.status}, Data da Reserva: {reserva.dataReserva},
                  Data do Registro: {reserva.dataRegistro}, Horário: {reserva.inicio} - {reserva.fim}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;

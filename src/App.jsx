import React, { useState, useCallback, useRef } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
  Handle,
  Position,
  ReactFlowProvider,
  useReactFlow,
} from '@xyflow/react';
import { Cpu, ToggleLeft, Lightbulb, Trash2, FilePlus, Table, Sigma, X, Sun, Moon } from 'lucide-react';
import '@xyflow/react/dist/style.css';
import './App.css';

// Componente para Nodos con Entrada Múltiple
const CustomGateNode = ({ data }) => {
  return (
    <div className="custom-node">
      {data.type !== 'input' && (
        <Handle
          type="target"
          position={Position.Left}
          id="in"
          style={{ background: '#7189ff', width: 12, height: 12 }}
        />
      )}

      {data.type === 'input' && <ToggleLeft color="#4caf50" size={20} />}
      {data.type === 'output' && <Lightbulb color="#00bcd4" size={20} />}
      {['and', 'or', 'not'].includes(data.type) && <Cpu color="#ff9800" size={20} />}
      
      <span>{data.label}</span>

      {data.type !== 'output' && (
        <Handle
          type="source"
          position={Position.Right}
          id="out"
          style={{ background: '#7189ff', width: 12, height: 12 }}
        />
      )}
    </div>
  );
};

const nodeTypes = { gateNode: CustomGateNode };
let idCounter = 1;

function FlowCanvas({ nodes, setNodes, edges, setEdges, onNodesChange, onEdgesChange, isDarkMode }) {
  const reactFlowWrapper = useRef(null);
  const { screenToFlowPosition } = useReactFlow();

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: '#7189ff', strokeWidth: 2 } }, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/reactflow-type');
      let label = event.dataTransfer.getData('application/reactflow-label');

      if (!type) return;

      const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });

      if (type === 'input') {
        const inputCount = nodes.filter((n) => n.data.type === 'input').length;
        label = `Entrada ${String.fromCharCode(65 + inputCount)}`;
      }

      const newNode = {
        id: `node_${idCounter++}`,
        type: 'gateNode',
        position,
        data: { label, type },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [nodes, screenToFlowPosition, setNodes]
  );

  return (
    <div style={{ flexGrow: 1, height: '100%' }} ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        colorMode={isDarkMode ? 'dark' : 'light'}
        fitView
      >
        <Background color={isDarkMode ? '#444' : '#ccc'} gap={16} size={1} />
        <Controls />
      </ReactFlow>
    </div>
  );
}

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isDarkMode, setIsDarkMode] = useState(true); // Estado del tema
  const [modalType, setModalType] = useState(null); // 'equation' o 'truthTable'
  const [equationText, setEquationText] = useState('');
  const [truthTableData, setTruthTableData] = useState({ headers: [], rows: [] });

  const onDragStart = (event, nodeType, label) => {
    event.dataTransfer.setData('application/reactflow-type', nodeType);
    event.dataTransfer.setData('application/reactflow-label', label);
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleNewCanvas = () => {
    if (window.confirm('¿Seguro que deseas crear una nueva hoja? Se borrará el circuito actual.')) {
      setNodes([]);
      setEdges([]);
    }
  };

  const handleDeleteSelected = () => {
    setNodes((nds) => nds.filter((node) => !node.selected));
    setEdges((eds) => eds.filter((edge) => !edge.selected));
  };

  const buildExpression = (nodeId) => {
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return '?';

    if (node.data.type === 'input') {
      return node.data.label.replace('Entrada ', '');
    }

    const incomingEdges = edges.filter((e) => e.target === nodeId);
    const sourceExpressions = incomingEdges.map((e) => buildExpression(e.source));

    if (sourceExpressions.length === 0) return '?';

    const type = node.data.type;
    if (type === 'not') return `¬(${sourceExpressions[0]})`;
    if (type === 'and') return `(${sourceExpressions.join(' · ')})`;
    if (type === 'or') return `(${sourceExpressions.join(' + ')})`;

    return sourceExpressions[0] || '?';
  };

  const handleShowEquation = () => {
    const outputNodes = nodes.filter((n) => n.data.type === 'output');
    if (outputNodes.length === 0) {
      alert('Agrega al menos un nodo de Salida (LED) al circuito.');
      return;
    }

    const eq = outputNodes.map((out) => {
      const incoming = edges.find((e) => e.target === out.id);
      const expr = incoming ? buildExpression(incoming.source) : '?';
      return `F = ${expr}`;
    }).join('\n');

    setEquationText(eq);
    setModalType('equation');
  };

  const evaluateNodeValue = (nodeId, inputValues) => {
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return 0;

    if (node.data.type === 'input') {
      const varName = node.data.label.replace('Entrada ', '');
      return inputValues[varName] || 0;
    }

    const incomingEdges = edges.filter((e) => e.target === nodeId);
    const inputs = incomingEdges.map((e) => evaluateNodeValue(e.source, inputValues));

    if (inputs.length === 0) return 0;

    const type = node.data.type;
    if (type === 'not') return inputs[0] === 1 ? 0 : 1;
    if (type === 'and') return inputs.every((v) => v === 1) ? 1 : 0;
    if (type === 'or') return inputs.some((v) => v === 1) ? 1 : 0;

    return inputs[0];
  };

  const handleShowTruthTable = () => {
    const inputNodes = nodes.filter((n) => n.data.type === 'input');
    const outputNodes = nodes.filter((n) => n.data.type === 'output');

    if (inputNodes.length === 0 || outputNodes.length === 0) {
      alert('El circuito debe tener al menos una Entrada y una Salida para calcular la tabla.');
      return;
    }

    const inputNames = inputNodes.map((n) => n.data.label.replace('Entrada ', ''));
    const outputNames = outputNodes.map((_, idx) => `Salida F${idx + 1}`);

    const numCombinations = Math.pow(2, inputNames.length);
    const rows = [];

    for (let i = 0; i < numCombinations; i++) {
      const inputValues = {};
      const rowValues = [];

      inputNames.forEach((name, idx) => {
        const val = (i >> (inputNames.length - 1 - idx)) & 1;
        inputValues[name] = val;
        rowValues.push(val);
      });

      outputNodes.forEach((out) => {
        const incoming = edges.find((e) => e.target === out.id);
        const outVal = incoming ? evaluateNodeValue(incoming.source, inputValues) : 0;
        rowValues.push(outVal);
      });

      rows.push(rowValues);
    }

    setTruthTableData({
      headers: [...inputNames, ...outputNames],
      rows,
    });
    setModalType('truthTable');
  };

  return (
    <div className={`app-container ${isDarkMode ? 'dark' : 'light'}`}>
      {/* Barra de Herramientas Superior */}
      <header className="top-bar">
        <div className="title">Simulador Lógico Pro</div>
        <div className="actions">
          <button className="btn" onClick={() => setIsDarkMode(!isDarkMode)}>
            {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
            {isDarkMode ? 'Modo Claro' : 'Modo Oscuro'}
          </button>
          <button className="btn" onClick={handleNewCanvas}><FilePlus size={16} /> Nueva Hoja</button>
          <button className="btn btn-danger" onClick={handleDeleteSelected}><Trash2 size={16} /> Eliminar Seleccionado</button>
          <button className="btn" onClick={handleShowEquation}><Sigma size={16} /> Ecuación Booleana</button>
          <button className="btn" onClick={handleShowTruthTable}><Table size={16} /> Tabla de Verdad</button>
        </div>
      </header>

      <div className="main-content">
        <aside className="sidebar">
          <h3>Componentes</h3>
          <div className="dnd-node input" onDragStart={(e) => onDragStart(e, 'input', 'Entrada')} draggable>
            <ToggleLeft size={18} /> Entrada
          </div>
          <div className="dnd-node output" onDragStart={(e) => onDragStart(e, 'output', 'Salida')} draggable>
            <Lightbulb size={18} /> Salida (LED)
          </div>

          <h3>Compuertas</h3>
          <div className="dnd-node gate" onDragStart={(e) => onDragStart(e, 'and', 'AND')} draggable>
            <Cpu size={18} /> Compuerta AND
          </div>
          <div className="dnd-node gate" onDragStart={(e) => onDragStart(e, 'or', 'OR')} draggable>
            <Cpu size={18} /> Compuerta OR
          </div>
          <div className="dnd-node gate" onDragStart={(e) => onDragStart(e, 'not', 'NOT')} draggable>
            <Cpu size={18} /> Compuerta NOT
          </div>
        </aside>

        <ReactFlowProvider>
          <FlowCanvas
            nodes={nodes}
            setNodes={setNodes}
            edges={edges}
            setEdges={setEdges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            isDarkMode={isDarkMode}
          />
        </ReactFlowProvider>
      </div>

      {/* Ventanas Modales Adaptables */}
      {modalType && (
        <div className="modal-overlay" onClick={() => setModalType(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{modalType === 'equation' ? 'Ecuación del Circuito' : 'Tabla de Verdad'}</h2>
              <button className="btn" onClick={() => setModalType(null)}><X size={18} /></button>
            </div>

            <div className="modal-body">
              {modalType === 'equation' && (
                <div className="equation-box">{equationText}</div>
              )}

              {modalType === 'truthTable' && (
                <table className="truth-table">
                  <thead>
                    <tr>
                      {truthTableData.headers.map((h, i) => <th key={i}>{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {truthTableData.rows.map((row, i) => (
                      <tr key={i}>
                        {row.map((cell, j) => <td key={j}>{cell}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const elementData = {
  Fire: { color: 'red-500', emoji: '🔥' },
  Water: { color: 'blue-500', emoji: '💧' },
  Air: { color: 'yellow-500', emoji: '💨' },
  Earth: { color: 'green-500', emoji: '🌿' },
  Neutral: { color: 'gray-500', emoji: '🔮' }
};

const cardData = [
  { id: 1, name: 'Puer', element: 'Fire', power: 5, ability: 'Attack twice', geomancyValue: 1 },
  { id: 2, name: 'Puella', element: 'Water', power: 4, ability: 'Heal 2 HP', geomancyValue: 2 },
  { id: 3, name: 'Amissio', element: 'Earth', power: 3, ability: 'Steal 1 power', geomancyValue: 3 },
  { id: 4, name: 'Acquisitio', element: 'Air', power: 6, ability: 'Draw a card', geomancyValue: 4 },
  { id: 5, name: 'Fortuna Major', element: 'Fire', power: 7, ability: 'Boost adjacent cards', geomancyValue: 5 },
  { id: 6, name: 'Albus', element: 'Water', power: 5, ability: 'Freeze enemy', geomancyValue: 6 },
  { id: 7, name: 'Populus', element: 'Water', power: 4, ability: 'Summon ally', geomancyValue: 7 },
  { id: 8, name: 'Via', element: 'Earth', power: 5, ability: 'Switch lanes', geomancyValue: 8 },
  { id: 9, name: 'Conjunctio', element: 'Air', power: 6, ability: 'Combine powers', geomancyValue: 9 },
  { id: 10, name: 'Carcer', element: 'Earth', power: 7, ability: 'Block attack', geomancyValue: 10 },
  { id: 11, name: 'Tristitia', element: 'Water', power: 3, ability: 'Weaken enemy', geomancyValue: 11 },
  { id: 12, name: 'Laetitia', element: 'Air', power: 5, ability: 'Boost power', geomancyValue: 12 },
  { id: 13, name: 'Cauda Draconis', element: 'Fire', power: 6, ability: 'Burn effect', geomancyValue: 13 },
  { id: 14, name: 'Caput Draconis', element: 'Earth', power: 6, ability: 'Defensive boost', geomancyValue: 14 },
  { id: 15, name: 'Fortuna Minor', element: 'Air', power: 4, ability: 'Quick attack', geomancyValue: 15 },
  { id: 16, name: 'Rubeus', element: 'Fire', power: 5, ability: 'Spread damage', geomancyValue: 16 },
];


const DraggableCard = ({ card, isInHand, isNew, onSelect }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'card',
    item: { card },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div 
      ref={drag}
      onClick={() => onSelect(card)}
      className={`relative border p-2 m-1 w-32 ${isNew ? 'animate-draw' : ''}
      ${isInHand ? 'cursor-pointer' : ''} bg-${elementData[card.element].color}
      ${isDragging ? 'opacity-50' : 'opacity-100'}`}
    >
      <div className="absolute top-1 right-1 bg-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
        {card.power}
      </div>
      <div className={`w-full h-24 flex items-center justify-center mb-2 rounded`}>
        <span className="text-4xl">{elementData[card.element].emoji}</span>
      </div>
      <h3 className="font-bold text-sm">{card.name}</h3>
      <p className="text-xs">Ability: {card.ability}</p>
    </div>
  );
};

const Lane = ({ cards, laneElement, laneIndex, onCardDrop, onCardSelect }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'card',
    drop: (item) => onCardDrop(item.card, laneIndex),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div 
      ref={drop}
      className={`flex flex-col items-center w-1/4 border-r border-gray-300 last:border-r-0 
      bg-${elementData[laneElement].color} bg-opacity-20 min-h-[200px]
      ${isOver ? 'border-4 border-yellow-400' : ''}`}
    >
      <div className="text-2xl mb-2">{elementData[laneElement].emoji}</div>
      {cards.map((card, index) => (
        <div key={card.id} onClick={() => onCardSelect(laneIndex, index)}>
          <DraggableCard card={card} />
        </div>
      ))}
    </div>
  );
};

const ActionPopup = ({ card, onAttack, onDivination, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-white p-4 rounded-lg">
      <h2 className="text-xl font-bold mb-4">{card.name}</h2>
      <button onClick={onAttack} className="bg-red-500 text-white px-4 py-2 rounded mr-2">Attack</button>
      <button onClick={onDivination} className="bg-purple-500 text-white px-4 py-2 rounded mr-2">Divination</button>
      <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
    </div>
  </div>
);

const Popup = ({ message, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-white p-4 rounded-lg">
      <p className="text-xl font-bold mb-4">{message}</p>
      <button onClick={onClose} className="bg-blue-500 text-white px-4 py-2 rounded">OK</button>
    </div>
  </div>
);

const CastingPool = ({ cards, onSelectCard }) => (
  <div className="flex justify-center mb-4">
    <h3 className="text-xl font-bold mr-4">Casting Pool:</h3>
    {cards.map(card => (
      <div key={card.id} onClick={() => onSelectCard(card)} className="cursor-pointer">
        <DraggableCard card={card} isInHand={false} />
      </div>
    ))}
  </div>
);

// ... (Part 3 begins)
const GeomancyCardGame = () => {
  const [playerHealth, setPlayerHealth] = useState(50);
  const [enemyHealth, setEnemyHealth] = useState(50);
  const [playerHand, setPlayerHand] = useState([]);
  const [enemyHand, setEnemyHand] = useState([]);
  const [playerField, setPlayerField] = useState([[], [], [], []]);
  const [enemyField, setEnemyField] = useState([[], [], [], []]);
  const [laneElements, setLaneElements] = useState(['Neutral', 'Neutral', 'Neutral', 'Neutral']);
  const [turn, setTurn] = useState(null);
  const [newCardIds, setNewCardIds] = useState([]);
  const [castingPool, setCastingPool] = useState([]);
  const [playerEnergy, setPlayerEnergy] = useState(1);
  const [enemyEnergy, setEnemyEnergy] = useState(1);
  const [gameLog, setGameLog] = useState([]);
  const [popup, setPopup] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const playerCast = castGeomancy();
    const enemyCast = castGeomancy();
    const firstPlayer = playerCast > enemyCast ? 'player' : 'enemy';
    setPopup(`${firstPlayer.charAt(0).toUpperCase() + firstPlayer.slice(1)} goes first!`);
    setTurn(firstPlayer);
    addToLog(`Game starts! ${firstPlayer.charAt(0).toUpperCase() + firstPlayer.slice(1)} goes first.`);
    drawInitialHand();
  };

  const drawInitialHand = () => {
    const playerCards = cardData.sort(() => 0.5 - Math.random()).slice(0, 8);
    const enemyCards = cardData.sort(() => 0.5 - Math.random()).slice(0, 8);
    setPlayerHand(playerCards);
    setEnemyHand(enemyCards);
    setNewCardIds(playerCards.map(card => card.id));
    setTimeout(() => setNewCardIds([]), 500);
  };

  const castGeomancy = () => Math.floor(Math.random() * 16) + 1;

  const selectCardFromCasting = (card) => {
    setPlayerHand(prevHand => [...prevHand, card]);
    setCastingPool(prevPool => prevPool.filter(c => c.id !== card.id));
    addToLog(`Added ${card.name} to hand from casting.`);
    if (castingPool.length === 1) {
      // If this was the last card in the casting pool, end the turn
      endTurn();
    }
  };

  const onCardDrop = (card, laneIndex) => {
    if (playerEnergy < card.power) {
      addToLog("Not enough energy to play this card.");
      return;
    }
    setPlayerField(prevField => {
      const newField = [...prevField];
      newField[laneIndex] = [...newField[laneIndex], card];
      updateLaneElements([...newField]);
      return newField;
    });
    setPlayerHand(prevHand => prevHand.filter(c => c.id !== card.id));
    setPlayerEnergy(prevEnergy => prevEnergy - card.power);
    addToLog(`Played ${card.name} in lane ${laneIndex + 1}.`);
  };

  const onCardSelect = (laneIndex, cardIndex) => {
    const card = playerField[laneIndex][cardIndex];
    setSelectedCard({ card, laneIndex, cardIndex });
  };

  const performAttack = () => {
    if (!selectedCard) return;
    const { card, laneIndex } = selectedCard;
    if (enemyField[laneIndex].length > 0) {
      const defendingCard = enemyField[laneIndex][enemyField[laneIndex].length - 1];
      defendingCard.power -= card.power;
      if (defendingCard.power <= 0) {
        setEnemyField(prevField => {
          const newField = [...prevField];
          newField[laneIndex] = newField[laneIndex].filter(c => c.id !== defendingCard.id);
          return newField;
        });
        addToLog(`${card.name} destroyed ${defendingCard.name}.`);
      } else {
        addToLog(`${card.name} dealt ${card.power} damage to ${defendingCard.name}.`);
      }
    } else {
      setEnemyHealth(prevHealth => Math.max(0, prevHealth - card.power));
      addToLog(`${card.name} dealt ${card.power} damage to enemy.`);
    }
    setSelectedCard(null);
  };

  const performDivination = () => {
    if (!selectedCard) return;
    const { card } = selectedCard;
    // Implement divination effects here
    addToLog(`Performed divination with ${card.name}.`);
    setSelectedCard(null);
  };

  const addToLog = (message) => {
    setGameLog(prevLog => [...prevLog, message]);
    setTimeout(() => setGameLog(prevLog => prevLog.slice(1)), 3000);
  };

  const updateLaneElements = (field) => {
    const newLaneElements = field.map(lane => {
      if (lane.length === 0) return 'Neutral';
      const elementCounts = lane.reduce((counts, card) => {
        counts[card.element] = (counts[card.element] || 0) + 1;
        return counts;
      }, {});
      return Object.keys(elementCounts).reduce((a, b) => elementCounts[a] > elementCounts[b] ? a : b);
    });
    setLaneElements(newLaneElements);
  };

  const endTurn = () => {
    if (turn === 'player') {
      setTurn('enemy');
      setEnemyEnergy(prevEnergy => Math.min(10, prevEnergy + 1));
      setPopup("Enemy's Turn");
      addToLog("Enemy turn starts.");
      setTimeout(enemyTurn, 1000);
    } else {
      setTurn('player');
      setPlayerEnergy(prevEnergy => Math.min(10, prevEnergy + 1));
      setPopup("Your Turn");
      performCasting();
      addToLog("Player turn starts.");
    }
  };

  const enemyTurn = () => {
    // Simplified enemy AI logic here
    // For now, just end the turn
    endTurn();
  };

  const performCasting = () => {
    const newCastingPool = [];
    for (let i = 0; i < 4; i++) {
      const geomancyValue = castGeomancy();
      const card = cardData.find(c => c.geomancyValue === geomancyValue);
      newCastingPool.push(card);
    }
    setCastingPool(newCastingPool);
    addToLog("New casting performed. Select a card to add to your hand.");
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col h-screen">
      // ... (continued from Part 3)

return (
  <DndProvider backend={HTML5Backend}>
    <div className="flex flex-col h-screen">
      {popup && <Popup message={popup} onClose={() => setPopup(null)} />}
      {selectedCard && (
        <ActionPopup 
          card={selectedCard.card}
          onAttack={performAttack}
          onDivination={performDivination}
          onClose={() => setSelectedCard(null)}
        />
      )}
      
      {/* Enemy Area */}
      <div className="bg-red-100 p-4">
        <div className="flex justify-between">
          <h2 className="text-xl font-bold">Enemy</h2>
          <p>Health: {enemyHealth}</p>
          <p>Energy: {enemyEnergy}</p>
        </div>
        <div className="flex justify-center">
          {enemyHand.map((_, index) => (
            <div key={index} className="w-16 h-24 bg-red-300 m-1 rounded"></div>
          ))}
        </div>
      </div>

      {/* Game Board */}
      <div className="flex-grow flex flex-col">
        <div className="flex-1">
          <h3 className="text-center font-bold">Enemy Field</h3>
          <div className="flex">
            {enemyField.map((lane, index) => (
              <Lane key={index} cards={lane} laneElement={laneElements[index]} laneIndex={index} onCardDrop={() => {}} onCardSelect={() => {}} />
            ))}
          </div>
        </div>
        <div className="flex justify-center items-center h-16">
          <div className="text-4xl">⬆️</div>
        </div>
        <div className="flex-1">
          <h3 className="text-center font-bold">Player Field</h3>
          <div className="flex">
            {playerField.map((lane, index) => (
              <Lane key={index} cards={lane} laneElement={laneElements[index]} laneIndex={index} onCardDrop={onCardDrop} onCardSelect={onCardSelect} />
            ))}
          </div>
        </div>
      </div>

      {/* Game Log */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        {gameLog.map((log, index) => (
          <p key={index} className="text-sm bg-white bg-opacity-75 p-2 rounded mb-2">{log}</p>
        ))}
      </div>

      {/* Player Area */}
      <div className="bg-blue-100 p-4">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-bold">Player</h2>
          <p>Health: {playerHealth}</p>
          <p>Energy: {playerEnergy}</p>
        </div>
        {castingPool.length > 0 && (
          <CastingPool cards={castingPool} onSelectCard={selectCardFromCasting} />
        )}
        <div className="flex justify-center">
          {playerHand.map(card => (
            <DraggableCard 
              key={card.id} 
              card={card} 
              isInHand={true}
              isNew={newCardIds.includes(card.id)}
              onSelect={() => {}}
            />
          ))}
        </div>
        <button 
          className={`mt-4 p-2 rounded ${turn === 'player' ? 'bg-green-500 text-white' : 'bg-gray-300'}`}
          onClick={endTurn} 
          disabled={turn !== 'player'}
        >
          End Turn
        </button>
      </div>
    </div>
  </DndProvider>
);



      </div>
    </DndProvider>
  );
};

export default GeomancyCardGame;
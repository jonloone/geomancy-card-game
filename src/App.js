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

const geomanticFigures = {
  'Via': ['•', '••', '•', '••'],
  'Populus': ['••', '••', '••', '••'],
  'Caput Draconis': ['•', '••', '••', '••'],
  'Cauda Draconis': ['••', '••', '••', '•'],
  'Puer': ['•', '•', '•', '••'],
  'Puella': ['••', '••', '•', '•'],
  'Fortuna Major': ['••', '•', '••', '•'],
  'Fortuna Minor': ['•', '••', '•', '••'],
  'Acquisitio': ['••', '•', '••', '••'],
  'Amissio': ['••', '••', '•', '••'],
  'Albus': ['••', '•', '•', '••'],
  'Rubeus': ['•', '••', '••', '•'],
  'Conjunctio': ['•', '•', '••', '•'],
  'Carcer': ['••', '•', '•', '••'],
  'Tristitia': ['•', '•', '•', '••'],
  'Laetitia': ['••', '••', '••', '•']
};

const cardData = [
  { id: 1, name: 'Puer', element: 'Fire', power: 5, ability: 'Attack twice', geomancyValue: 1, geomancySymbol: '•' },
  { id: 2, name: 'Puella', element: 'Water', power: 4, ability: 'Heal 2 HP', geomancyValue: 2, geomancySymbol: '••' },
  { id: 3, name: 'Amissio', element: 'Earth', power: 3, ability: 'Steal 1 power', geomancyValue: 3, geomancySymbol: '•' },
  { id: 4, name: 'Acquisitio', element: 'Air', power: 6, ability: 'Draw a card', geomancyValue: 4, geomancySymbol: '••' },
  { id: 5, name: 'Fortuna Major', element: 'Fire', power: 7, ability: 'Boost adjacent cards', geomancyValue: 5, geomancySymbol: '••' },
  { id: 6, name: 'Albus', element: 'Water', power: 5, ability: 'Freeze enemy', geomancyValue: 6, geomancySymbol: '•' },
  { id: 7, name: 'Populus', element: 'Water', power: 4, ability: 'Summon ally', geomancyValue: 7, geomancySymbol: '••' },
  { id: 8, name: 'Via', element: 'Earth', power: 5, ability: 'Switch lanes', geomancyValue: 8, geomancySymbol: '•' },
  { id: 9, name: 'Conjunctio', element: 'Air', power: 6, ability: 'Combine powers', geomancyValue: 9, geomancySymbol: '•' },
  { id: 10, name: 'Carcer', element: 'Earth', power: 7, ability: 'Block attack', geomancyValue: 10, geomancySymbol: '••' },
  { id: 11, name: 'Tristitia', element: 'Water', power: 3, ability: 'Weaken enemy', geomancyValue: 11, geomancySymbol: '•' },
  { id: 12, name: 'Laetitia', element: 'Air', power: 5, ability: 'Boost power', geomancyValue: 12, geomancySymbol: '••' },
  { id: 13, name: 'Cauda Draconis', element: 'Fire', power: 6, ability: 'Burn effect', geomancyValue: 13, geomancySymbol: '••' },
  { id: 14, name: 'Caput Draconis', element: 'Earth', power: 6, ability: 'Defensive boost', geomancyValue: 14, geomancySymbol: '•' },
  { id: 15, name: 'Fortuna Minor', element: 'Air', power: 4, ability: 'Quick attack', geomancyValue: 15, geomancySymbol: '•' },
  { id: 16, name: 'Rubeus', element: 'Fire', power: 5, ability: 'Spread damage', geomancyValue: 16, geomancySymbol: '••' },
];

const shuffleDeck = (deck) => {
  return [...deck].sort(() => Math.random() - 0.5);
};

const checkLaneForGeomanticFigure = (lane) => {
  if (lane.length !== 4) return null;
  const lanePattern = lane.map(card => card.geomancySymbol);
  for (const [figure, pattern] of Object.entries(geomanticFigures)) {
    if (JSON.stringify(lanePattern) === JSON.stringify(pattern)) {
      return figure;
    }
  }
  return null;
};

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
      className={`relative border p-2 m-1 w-32 ${isNew ? 'card-draw-animation' : ''}
      ${isInHand ? 'cursor-pointer' : ''} bg-${elementData[card.element].color}
      ${isDragging ? 'opacity-50' : 'opacity-100'} transition-all duration-300 hover:scale-105`}
    >
      <div className="absolute top-1 right-1 bg-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
        ⚡{card.power}
      </div>
      <div className={`w-full h-24 flex items-center justify-center mb-2 rounded`}>
        <span className="text-4xl">{elementData[card.element].emoji}</span>
      </div>
      <h3 className="font-bold text-sm">{card.name}</h3>
      <p className="text-xs">Ability: {card.ability}</p>
      <p className="text-xs mt-1">Geomancy: {card.geomancySymbol}</p>
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

  const activeFigure = checkLaneForGeomanticFigure(cards);

  return (
    <div 
      ref={drop}
      className={`flex flex-col items-center w-1/4 border-r border-gray-300 last:border-r-0 
      bg-${elementData[laneElement].color} bg-opacity-20 min-h-[200px]
      ${isOver ? 'border-4 border-yellow-400' : ''}
      ${activeFigure ? 'ring-4 ring-purple-500 animate-pulse' : ''}`}
    >
      <div className="text-2xl mb-2">{elementData[laneElement].emoji}</div>
      {cards.map((card, index) => (
        <div key={card.id} onClick={() => onCardSelect(laneIndex, index)}>
          <DraggableCard card={card} />
        </div>
      ))}
      {activeFigure && (
        <div className="mt-2 text-purple-700 font-bold animate-bounce">{activeFigure} Active!</div>
      )}
    </div>
  );
};

const ActionPopup = ({ card, onAttack, onDivination, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-white p-4 rounded-lg animate-fadeIn">
      <h2 className="text-xl font-bold mb-4">{card.name}</h2>
      <button onClick={onAttack} className="bg-red-500 text-white px-4 py-2 rounded mr-2 hover:bg-red-600 transition-colors">Attack</button>
      <button onClick={onDivination} className="bg-purple-500 text-white px-4 py-2 rounded mr-2 hover:bg-purple-600 transition-colors">Divination</button>
      <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors">Cancel</button>
    </div>
  </div>
);

const Popup = ({ message, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-white p-4 rounded-lg animate-fadeIn">
      <p className="text-xl font-bold mb-4">{message}</p>
      <button onClick={onClose} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">OK</button>
    </div>
  </div>
);

const CastingPool = ({ cards, onSelectCard }) => (
  <div className="flex justify-center mb-4 animate-slideIn">
    <h3 className="text-xl font-bold mr-4">Casting Pool:</h3>
    {cards.map(card => (
      <div key={card.id} onClick={() => onSelectCard(card)} className="cursor-pointer">
        <DraggableCard card={card} isInHand={false} isNew={true} />
      </div>
    ))}
  </div>
);

const GameLog = ({ logs }) => (
  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-64 h-96 overflow-y-auto bg-white bg-opacity-75 p-2 rounded">
    <h3 className="font-bold mb-2">Game Log</h3>
    {logs.map((log, index) => (
      <p key={index} className="text-sm mb-1">{log}</p>
    ))}
  </div>
);

const GameOverPopup = ({ winner, onRestart }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-white p-4 rounded-lg animate-fadeIn text-center">
      <h2 className="text-2xl font-bold mb-4">{winner} Wins!</h2>
      <button onClick={onRestart} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors">
        Play Again
      </button>
    </div>
  </div>
);

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
  const [playerDeck, setPlayerDeck] = useState(shuffleDeck(cardData));
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [showCastingOverlay, setShowCastingOverlay] = useState(false);
  const [showTurnTransition, setShowTurnTransition] = useState(false);
  // ... (continued from Part 4)
const CastingOverlay = ({ cards, onSelectCard }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 animate-fadeIn">
      <div className="text-center">
        <h2 className="text-white text-2xl mb-4 animate-slideIn">Select a card to add to your hand</h2>
        <div className="flex justify-center space-x-4">
          {cards.map(card => (
            <div key={card.id} className="animate-cardFlip" onClick={() => onSelectCard(card)}>
              <DraggableCard card={card} isInHand={false} isNew={true} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

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
    const playerCards = playerDeck.slice(0, 8);
    const enemyCards = shuffleDeck(cardData).slice(0, 8);
    setPlayerHand(playerCards);
    setEnemyHand(enemyCards);
    setPlayerDeck(prevDeck => prevDeck.slice(8));
    setNewCardIds(playerCards.map(card => card.id));
    setTimeout(() => setNewCardIds([]), 500);
  };

  const TurnTransition = ({ currentTurn }) => (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 animate-fadeIn">
      <div className="text-6xl font-bold text-white animate-pulse">
        {currentTurn === 'player' ? "Your Turn!" : "Enemy's Turn!"}
      </div>
    </div>
  );

  const castGeomancy = () => Math.floor(Math.random() * 16) + 1;

  const performCasting = () => {
    if (playerDeck.length < 4) {
      setPlayerDeck(shuffleDeck(cardData));
    }
    const newCastingPool = playerDeck.slice(0, 4);
    setCastingPool(newCastingPool);
    setPlayerDeck(prevDeck => prevDeck.slice(4));
    setShowCastingOverlay(true);
    addToLog("New casting performed. Select a card to add to your hand.");
  };

  const selectCardFromCasting = (card) => {
    setPlayerHand(prevHand => [...prevHand, card]);
    setCastingPool(prevPool => prevPool.filter(c => c.id !== card.id));
    addToLog(`Added ${card.name} to hand from casting.`);
    setNewCardIds([card.id]);
    setTimeout(() => setNewCardIds([]), 500);
  
    const overlay = document.querySelector('.animate-fadeIn');
    if (overlay) {
      overlay.classList.remove('animate-fadeIn');
      overlay.classList.add('animate-fadeOut');
    }
    setTimeout(() => {
      setShowCastingOverlay(false);
      if (castingPool.length === 1) {
        setCastingPool([]);
      }
    }, 300);
  };

  const onCardDrop = (card, laneIndex) => {
    if (playerEnergy < card.power) {
      addToLog("Not enough energy to play this card.");
      return;
    }
    if (playerField[laneIndex].length >= 4) {
      addToLog("This lane is full. Choose another lane.");
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
    checkAndActivateGeomanticEffect(laneIndex);
  };

  const onCardSelect = (laneIndex, cardIndex) => {
    const card = playerField[laneIndex][cardIndex];
    setSelectedCard({ card, laneIndex, cardIndex });
  };

  // ... (to be continued in the next part)

  // ... (continued from Part 3)

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
      setEnemyHealth(prevHealth => {
        const newHealth = Math.max(0, prevHealth - card.power);
        if (newHealth <= 0) {
          setGameOver(true);
          setWinner('Player');
        }
        return newHealth;
      });
      addToLog(`${card.name} dealt ${card.power} damage to enemy.`);
    }
    setSelectedCard(null);
  };

  const performDivination = () => {
    if (!selectedCard) return;
    const { card } = selectedCard;
    // Implement divination effects here based on the card's ability
    addToLog(`Performed divination with ${card.name}.`);
    setSelectedCard(null);
  };

  const addToLog = (message) => {
    setGameLog(prevLog => [...prevLog, message]);
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

  const checkAndActivateGeomanticEffect = (laneIndex) => {
    const activeFigure = checkLaneForGeomanticFigure(playerField[laneIndex]);
    if (activeFigure) {
      activateGeomanticEffect(activeFigure, laneIndex);
    }
  };

  const activateGeomanticEffect = (figure, laneIndex) => {
    addToLog(`Activated ${figure} effect in lane ${laneIndex + 1}!`);
    switch(figure) {
      case 'Via':
        setPlayerEnergy(prevEnergy => Math.min(10, prevEnergy + 2));
        addToLog('Via effect: Gained 2 energy!');
        break;
      case 'Populus':
        setPlayerHealth(prevHealth => Math.min(50, prevHealth + 5));
        addToLog('Populus effect: Healed 5 HP!');
        break;
      case 'Caput Draconis':
        setPlayerField(prevField => {
          const newField = [...prevField];
          newField[laneIndex] = newField[laneIndex].map(card => ({...card, power: card.power + 1}));
          return newField;
        });
        addToLog('Caput Draconis effect: Boosted power of all cards in this lane!');
        break;
      case 'Cauda Draconis':
        setEnemyField(prevField => {
          const newField = [...prevField];
          newField[laneIndex] = newField[laneIndex].map(card => ({...card, power: Math.max(0, card.power - 1)}));
          return newField;
        });
        addToLog('Cauda Draconis effect: Weakened all enemy cards in this lane!');
        break;
      // Add more effects for other figures
    }
    // Clear the lane after activating the effect
    setPlayerField(prevField => {
      const newField = [...prevField];
      newField[laneIndex] = [];
      return newField;
    });
  };




  const endTurn = () => {
    const newTurn = turn === 'player' ? 'enemy' : 'player';
    setTurn(newTurn);
    setShowTurnTransition(true);
    setTimeout(() => {
      setShowTurnTransition(false);
      if (newTurn === 'enemy') {
        setEnemyEnergy(prevEnergy => Math.min(10, prevEnergy + 1));
        enemyTurn();
      } else {
        setPlayerEnergy(prevEnergy => Math.min(10, prevEnergy + 1));
        performCasting();
      }
    }, 2000); // Show transition for 2 seconds
  };

const onHandCardSelect = (cardIndex) => {
  const card = playerHand[cardIndex];
  setSelectedCard({ card, laneIndex: -1, cardIndex });
};



const enemyTurn = () => {
  addToLog("Enemy turn starts.");

  // Try to play a card
  if (enemyHand.length > 0 && enemyEnergy > 0) {
    const playableCards = enemyHand.filter(card => card.power <= enemyEnergy);
    if (playableCards.length > 0) {
      const cardToPlay = playableCards[Math.floor(Math.random() * playableCards.length)];
      const availableLanes = enemyField.reduce((acc, lane, index) => {
        if (lane.length < 4) acc.push(index);
        return acc;
      }, []);

      if (availableLanes.length > 0) {
        const laneToPlay = availableLanes[Math.floor(Math.random() * availableLanes.length)];
        setEnemyField(prevField => {
          const newField = [...prevField];
          newField[laneToPlay] = [...newField[laneToPlay], cardToPlay];
          return newField;
        });
        setEnemyHand(prevHand => prevHand.filter(c => c.id !== cardToPlay.id));
        setEnemyEnergy(prevEnergy => prevEnergy - cardToPlay.power);
        addToLog(`Enemy played ${cardToPlay.name} in lane ${laneToPlay + 1}.`);
      }
    }
  }

  // Enemy attack phase
  enemyField.forEach((lane, laneIndex) => {
    lane.forEach(card => {
      if (playerField[laneIndex].length > 0) {
        const defendingCard = playerField[laneIndex][playerField[laneIndex].length - 1];
        defendingCard.power -= card.power;
        if (defendingCard.power <= 0) {
          setPlayerField(prevField => {
            const newField = [...prevField];
            newField[laneIndex] = newField[laneIndex].filter(c => c.id !== defendingCard.id);
            return newField;
          });
          addToLog(`Enemy's ${card.name} destroyed ${defendingCard.name}.`);
        } else {
          addToLog(`Enemy's ${card.name} dealt ${card.power} damage to ${defendingCard.name}.`);
        }
      } else {
        setPlayerHealth(prevHealth => {
          const newHealth = Math.max(0, prevHealth - card.power);
          if (newHealth <= 0) {
            setGameOver(true);
            setWinner('Enemy');
          }
          return newHealth;
        });
        addToLog(`Enemy's ${card.name} dealt ${card.power} damage to you.`);
      }
    });
  });

  addToLog("Enemy turn ends.");
  
  // Ensure the turn always ends, even if no actions were taken
  setTimeout(() => {
    setTurn('player');
    setPlayerEnergy(prevEnergy => Math.min(10, prevEnergy + 1));
    
  }, 1000);
};

const playerHasValidMoves = () => {
  return playerHand.some(card => card.power <= playerEnergy) || playerField.some(lane => lane.length > 0);
};

const restartGame = () => {
  setPlayerHealth(50);
  setEnemyHealth(50);
  setPlayerHand([]);
  setEnemyHand([]);
  setPlayerField([[], [], [], []]);
  setEnemyField([[], [], [], []]);
  setLaneElements(['Neutral', 'Neutral', 'Neutral', 'Neutral']);
  setTurn(null);
  setNewCardIds([]);
  setCastingPool([]);
  setPlayerEnergy(1);
  setEnemyEnergy(1);
  setGameLog([]);
  setPopup(null);
  setSelectedCard(null);
  setPlayerDeck(shuffleDeck(cardData));
  setGameOver(false);
  setWinner(null);
  initializeGame();
};

return (
  <DndProvider backend={HTML5Backend}>
    <div className="flex flex-col h-screen bg-gray-100">
      {showCastingOverlay && (
        <CastingOverlay cards={castingPool} onSelectCard={selectCardFromCasting} />
      )}
      {showTurnTransition && <TurnTransition currentTurn={turn} />}
      {popup && <Popup message={popup} onClose={() => setPopup(null)} />}
      {selectedCard && (
        <ActionPopup
          card={selectedCard.card}
          onAttack={performAttack}
          onDivination={performDivination}
          onClose={() => setSelectedCard(null)}
        />
      )}
      {gameOver && (
        <GameOverPopup winner={winner} onRestart={restartGame} />
      )}
     
      {/* Enemy Area */}
      <div className="bg-red-100 p-4">
        <div className="flex justify-between">
          <h2 className="text-xl font-bold">Enemy</h2>
          <p>Health: {enemyHealth}</p>
          <p>Energy: ⚡{enemyEnergy}</p>
        </div>
        <div className="flex justify-center">
          {enemyHand.map((_, index) => (
            <div key={index} className="w-16 h-24 bg-red-300 m-1 rounded"></div>
          ))}
        </div>
      </div>

      {/* Game Board */}
      <div className="flex-grow flex flex-col game-board">
        <div className="flex-1">
          <h3 className="text-center font-bold text-white">Enemy Field</h3>
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
          <h3 className="text-center font-bold text-white">Player Field</h3>
          <div className="flex">
            {playerField.map((lane, index) => (
              <Lane key={index} cards={lane} laneElement={laneElements[index]} laneIndex={index} onCardDrop={onCardDrop} onCardSelect={onCardSelect} />
            ))}
          </div>
        </div>
      </div>

      <GameLog logs={gameLog} />

      {/* Player Area */}
      <div className="bg-blue-100 p-4">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-bold">Player</h2>
          <p>Health: {playerHealth}</p>
          <p>Energy: ⚡{playerEnergy}</p>
        </div>
        <div className="flex justify-center">
          {playerHand.map(card => (
            <DraggableCard
              key={card.id}
              card={card}
              isInHand={true}
              isNew={newCardIds.includes(card.id)}
              onSelect={() => onHandCardSelect(playerHand.indexOf(card))}
            />
          ))}
        </div>
        <button
          className={`mt-4 p-2 rounded ${(turn === 'player' || !playerHasValidMoves()) ? 'bg-green-500 text-white' : 'bg-gray-300'}`}
          onClick={endTurn}
          disabled={turn !== 'player' && playerHasValidMoves()}
        >
          End Turn
        </button>
      </div>
    </div>
  </DndProvider>
);
}  // This closing brace ends the GeomancyCardGame component function

export default GeomancyCardGame;
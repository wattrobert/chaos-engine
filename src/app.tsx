import React, { useState, useEffect } from "react";
import Character from "./Character";
import fs from "fs";
import path from "path";

const DATA_DIR = path.resolve("./data");

function App() {
  const [characters, setCharacters] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [displayJSON, setDisplayJSON] = useState<string>("");

  useEffect(() => {
    const files = fs.existsSync(DATA_DIR)
      ? fs.readdirSync(DATA_DIR).filter(f => f.endsWith(".json"))
      : [];
    setCharacters(files);
  }, []);

  const generateCharacter = () => {
    const character = new Character();
    const json = JSON.stringify({
      character_id: character.character_id,
      name: character.name,
      species: character.species,
      style: character.style,
      quirk: character.quirk,
      prompts: character.prompts
    }, null, 2);
    character.saveToFile();
    setDisplayJSON(json);
    setCharacters(prev => [...new Set([...prev, `${character.character_id}.json`])]);
    setSelected(`${character.character_id}.json`);
  };

  const loadCharacter = (filename: string) => {
    const filepath = path.join(DATA_DIR, filename);
    const json = fs.readFileSync(filepath, "utf-8");
    setDisplayJSON(json);
    setSelected(filename);
  };

  return (
    <div className="flex p-4 gap-6">
      <div className="w-1/4 space-y-4">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
          onClick={generateCharacter}
        >
          Generate New Character
        </button>
        <ul className="overflow-y-auto max-h-[500px] border rounded p-2 bg-white">
          {characters.map(filename => (
            <li
              key={filename}
              className={`p-1 cursor-pointer hover:bg-gray-100 rounded ${filename === selected ? 'bg-gray-200' : ''}`}
              onClick={() => loadCharacter(filename)}
            >
              {filename.replace(".json", "")}
            </li>
          ))}
        </ul>
      </div>
      <div className="w-3/4">
        <pre className="bg-gray-900 text-green-300 p-4 rounded overflow-auto h-[600px]">
          {displayJSON || "Select or generate a character to view JSON."}
        </pre>
      </div>
    </div>
  );
}

export default App;

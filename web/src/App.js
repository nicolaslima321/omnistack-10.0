import React, { useEffect, useState } from 'react';

import api from './Services/api'

import './global.css';
import './App.css';
import './Sidebar.css';
import './Main.css';
import Axios from 'axios';

import DevItem from './Components/DevItem/index.js'

// Componentes: Bloco isolado de HTML, CSS e JS, o qual não interfere no restante da aplicação
// Propriedade: Informações que um componente PAI passa para um componente FILHO (Ex: Atributo de uma tag JSX)
// Estado: Informações mantidas pelo componente (Lembrar: imutabilidade)

function App() {
  const [devs, setDevs] = useState([])

  const [github_username, setGithubUsername] = useState('')
  const [techs, setTechs] = useState('')

  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        console.log(position)
        const { latitude, longitude } = position.coords
        setLatitude(latitude)
        setLongitude(longitude)
      },
      function (error) {
        console.log(error)
      },
      {
        timout: 30000
      }
    )
  }, [])

  useEffect(() => {
    async function loadDevs() {
      const response = await api.get('/devs')

      setDevs(response.data)
    }

    loadDevs()
  }, [])

  async function handleAddDev(e) {
    e.preventDefault()

    const response = await api.post('/devs', {
      github_username,
      techs,
      latitude,
      longitude
    })

    setGithubUsername('')
    setTechs('')

    setDevs([...devs, response.data])

    console.log(response.data)
  }

  return (
    <div id="app">
      <aside>
        <strong>Cadastrar</strong>
        <form onSubmit={handleAddDev}>
          <div className="input-block">
            <label htmlFor="github_username">Usuário do Github</label>
            <input
              name="github_username"
              id="github_username"
              required
              value={github_username}
              onChange={e => setGithubUsername(e.target.value)}
            />
          </div>

          <div className="input-block">
            <label htmlFor="techs">Tecnologias</label>
            <input
              name="techs"
              id="techs"
              required
              value={techs}
              onChange={e => setTechs(e.target.value)}
            />
          </div>

          <div className="input-group">
            <div className="input-block">
              <label htmlFor="latitude">Latitude</label>
              <input
                type="number"
                name="latitude"
                id="latitude"
                required
                value={latitude}
                onChange={e => setLatitude(e.target.value)}
              />
            </div>

            <div className="input-block">
              <label htmlFor="longitude">Longitude</label>
              <input 
                type="number" 
                name="longitude" 
                id="longitude" 
                required 
                value={longitude} 
                onChange={e => setLongitude(e.target.value)}
              />
            </div>
          </div>

          <button type="submit">Salvar</button>
        </form>
      </aside>
      <main>
        <ul>
          {devs.map(dev => (
            <DevItem key={dev.id} dev={dev}></DevItem>
          ))}
        </ul>
      </main>
    </div>
  );
}

export default App;

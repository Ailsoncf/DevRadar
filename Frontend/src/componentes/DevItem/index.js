import React from 'react'
import './styles.css'
import { FiTrash2 } from 'react-icons/fi'


function DevItem({ dev }){
    return(
      <li className='dev-item'>
      <header>
        <img src={dev.avatar_url} alt={dev.name} />
        <div className='user-info'>
          <strong>{dev.name}</strong>
          <span>{dev.techs.join(', ')}</span>
        </div>
        <div className='trash-button'>
        <button type="button">
          <FiTrash2 size={18} color="#a8a8b3"/>
        </button>
        </div>
      </header>
      <p>{dev.bio}</p>
      <a href={`https://github.com/${dev.github_username}`}>Acessar Perfil do Github</a>
      </li> 
    )
}

export default DevItem
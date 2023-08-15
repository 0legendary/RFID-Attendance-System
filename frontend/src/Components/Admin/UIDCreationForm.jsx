import React,{useState} from 'react'

function UIDCreationForm(props) {
    const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    // Perform any further actions, such as sending the data to the backend
    // ...
  };
  return ( 
    <div>
      <div className="uid-creation-form">
      <h2>Create UID</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="uid">UID: </label>
        <input type="text" id="uid" value={props.uid}  readOnly />

        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Create</button>
      </form>
    </div>
    </div>
  )
}

export default UIDCreationForm

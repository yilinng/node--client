import {useState} from 'react'

export default function EditItem({clickItem, getData}) {

    const [name, setName] = useState(clickItem.name);
    const [subscribedToChannel, setSubscribedToChannel] = useState(clickItem.subscribedToChannel);
    
    const handleSubmit = (e) => {
        e.preventDefault();
        if(name.length && subscribedToChannel.length > 0){

            const data = {name, subscribedToChannel};
            
            fetch('/subscribers/' + clickItem._id, {
            method: 'PATCH', // or 'PUT'
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
            })
            .then(response => response.json())
            .then(data => {
            console.log('Update Success:', data);
            getData();
            })
            .catch((error) => {
            console.error('Update Error:', error);
            });

        }else {
            console.log('input field required');
          }
    }
    return (
        <div className="edit">
             <form onSubmit={handleSubmit}>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="name..."/>
                <input type="text" value={subscribedToChannel} onChange={(e) => setSubscribedToChannel(e.target.value)} placeholder="subscribedToChannel..."/>
                <button>edit subscribe</button>
            </form>
        </div>
    )
}

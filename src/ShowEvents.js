import React, { Component } from 'react';
import {Collapse} from 'react-collapse';
import './showevents.css';
import axios from 'axios';
import Modal from 'react-modal';
Modal.setAppElement('#root');
class Showevents extends Component{
	constructor(props){
		super(props);
		this.state={
			events:[],
			modalIsOpen: false,
			modalId:'' //used to pass id in to the modal
		}
    	this.closeModal = this.closeModal.bind(this);

	}
	componentDidMount(){
		axios.get('reactjs-dallas/events')
		.then(res=>{
			this.setState({events:res.data})
		})
	}

	//modal function 
	openModal(id) {
        this.setState({modalIsOpen: true,modalId:id});
    }
    closeModal() {
    	this.setState({modalIsOpen: false});
  	}
	render(){

		let {events,modalIsOpen}=this.state;
		return (
			<div>
				<Modal
          				isOpen={modalIsOpen}
          				onAfterOpen={this.afterOpenModal}
          				onRequestClose={this.closeModal}
          				className='modal'
          				contentLabel="RSVPs"
        			>	
        			<div className='closeModal' onClick={this.closeModal}>✕</div>
        			<Getrsvps id={this.state.modalId}/>
        		</Modal>
        		
				<ol className='container'>
					{events.map((event,index)=>
					<li className='list' key={index}>	
						<div className='time'>Time: {event.local_date} {event.local_time}</div>
						<a href={event.link}>{event.name}</a>
						<div>	
							<button className='modal-button' onClick={()=>this.openModal(event.id)}>RSVPs</button>
							<Details description={event.description}/>						
						</div>
						
					</li>
					)}
				</ol>
			</div>
		)
	}
}
class Details extends Component{
	constructor(props){
		super(props);
		this.state={
			isopen:false,
		}
		this.handleClick=this.handleClick.bind(this)
	}
	
	handleClick(){
		this.setState({isopen:!this.state.isopen})
	}

	render(){
		
		return(<div>
			<button className='collapse'  onClick={this.handleClick}>Details</button>
			<Collapse isOpened={this.state.isopen}>
				<div dangerouslySetInnerHTML={{ __html: this.props.description }}></div>
			</Collapse>
			
		</div>)
	}
}
class Getrsvps extends Component{
	constructor(props){
		super(props);
		this.state={
			organizer: '',
			willgo:[],
			willnot:[],
			waitlist:[],
		}
	}
	componentDidMount(){
		axios.get(`reactjs-dallas/events/${this.props.id}/rsvps`)
		.then(res=>{
			this.setState({
				organizer:res.data.find(item => item.member.role === 'organizer'),
				willgo:res.data.filter(item => item.response === 'yes'),
				willnot:res.data.filter(item => item.response === 'no'),
				waitlist:res.data.filter(item => item.response === 'waitlist'),
			})
		})
	}
	render(){

		let {organizer,willgo,willnot,waitlist}=this.state;	
		
		if(!organizer) return null;
		return (
			<div>
				<div>Organizer:</div>
				<InfoCard image={organizer.member.photo.thumb_link} name={organizer.member.name}/>

				<div className="group">Will Attend</div>	
				<div className='modal-container'>
				{willgo.map((person,index)=>
					<InfoCard key={index} image={person.member.photo.thumb_link} name={person.member.name}/>
				)}
				</div>
				<div className="group">Will Not Attend</div>	
				<div className='modal-container'>
				{willnot.map((person,index)=>
					<InfoCard key={index} image={person.member.photo.thumb_link} name={person.member.name}/>
				)}
				</div>
				<div className="group"> Waiting List</div>	
				<div className='modal-container'>
				{waitlist.map((person,index)=>
					<InfoCard key={index} image={person.member.photo.thumb_link} name={person.member.name}/>
				)}
				</div>
			</div>
		)
	}
}
const InfoCard=(props)=>(
	<div className='card'>
		<img className='avatar' src={props.image} alt={props.name} />
		<div className='member'>{props.name}</div>
	</div>);

export default Showevents;
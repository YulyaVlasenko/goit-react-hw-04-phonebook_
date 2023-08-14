import { Component } from "react"
import ContactForm from "./ContactForm/ContactForm"
import { Section } from "./Section/Section"
import ContactList from "./ContactList/ContactList"
import Filter from "./Filter/Filter"
import toast, { Toaster } from 'react-hot-toast'



class App extends Component {
  state = {
    contacts: null,
    filter: '',
  }

  componentDidMount = () => {
    const savedList = localStorage.getItem('contacts')
    if (savedList)
      this.setState({
        contacts: JSON.parse(savedList)
      })
  }


  componentDidUpdate = (prevProps, prevState) => {
    if (prevState.contacts !== this.state.contacts)
      localStorage.setItem('contacts', JSON.stringify(this.state.contacts))
    
    if (prevState.contacts && prevState.contacts.length < this.state.contacts.length)
      toast.success('Create contact successfully!')
        
    if (prevState.contacts && prevState.contacts.length > this.state.contacts.length)
      toast.error('Delete contact successfully!')
  }
  

  createContact = (contact) => {
    this.setState(prevState => ({
      contacts: [...prevState.contacts, contact]
    }));
  }

  getListOfContacts = () => {
    const { contacts, filter } = this.state;
    if (!contacts) return [];
    const filterValue = filter.toLowerCase()
    return contacts && contacts.filter((contact) =>
      contact.name.toLowerCase().includes(filterValue)
    )
  }

  handleChangeFilter = ({ target: { value } }) => {
    this.setState({
      filter: value,
    })
  }


  deleteContact = (contactForDelete) => {
    this.setState(prevState =>
      ({ contacts:prevState.contacts.filter(contact => contact.id !== contactForDelete) })
    )
  }

  render() {
    const { filter, contacts } = this.state
    const listOfContacts = this.getListOfContacts();
    const isContactListEmpty = listOfContacts && listOfContacts.length === 0;
   
    return (
      <>
        <Section title='Phonebook'>
          <ContactForm createContact={this.createContact} contacts={contacts} />
        </Section>
        
        <Section title='Contacts'>
          <Filter title='Find contacts by name' handleChangeFilter={this.handleChangeFilter} value={filter} />
          {!isContactListEmpty && <ContactList contacts={this.getListOfContacts()} deleteContact={this.deleteContact} />}
        </Section>
        <Toaster />
      </>
    )
    
  }

}
export default App

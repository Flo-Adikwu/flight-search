import './App.css';
import { Container } from '@mui/material';
import SearchForm from './components/SearchForm';
import SearchResults from './components/SearchResults';

function App() {
  return (
    <Container>
      <SearchForm/>
      <SearchResults/>
    </Container>
  );
}

export default App;

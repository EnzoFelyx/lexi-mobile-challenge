import journal from './meta/_journal.json';
import m0000 from './0000_lucky_mercury.sql';
import m0001 from './0001_reseed_with_common_words.sql';

  export default {
    journal,
    migrations: {
      m0000,
m0001
    }
  }
  
import { Typography, Link } from '@material-ui/core';

const Copyright = () => {
  return (
    <Typography variant="body2" color="text.secondary" mt={5}>
      {'Copyright © '}
      <Link color="inherit" href="https://ai.google.dev/gemini-api">
      UniBodim - Finder
      </Link> {' '}
      {new Date().getFullYear()}
    </Typography>
  );
}

export default Copyright;
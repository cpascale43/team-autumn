import React, { useState, useContext } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';

import UserContext from '../components/UserContext';
import { formStyles } from '../assets/styles/styles';

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [, setUser] = useContext(UserContext);
  const history = useHistory();
  const classes = formStyles();

  const { register, handleSubmit } = useForm();

  const onFormSubmit = async (data) => {
    setLoading(true);
    const formData = {
      email: data.email,
      password: data.password,
    };

    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const res = await response.json();
      const userData = res.user_info;

      localStorage.setItem(
        'user',
        JSON.stringify({
          firstName: userData.first_name,
          lastName: userData.last_name,
          email: userData.email,
        })
      );

      setUser({
        firstName: userData.first_name,
        lastName: userData.last_name,
        email: userData.email,
      });

      setLoading(false);
      history.push('/campaigns');
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) {
    return (
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress />
      </Backdrop>
    );
  }

  return (
    <Container component="main" maxWidth="sm">
      <Box boxShadow={1}>
        <div className={classes.paper}>
          <Typography className={classes.title} component="h2" variant="h4">
            Login to your account
          </Typography>
          <form className={classes.form} onSubmit={handleSubmit((data) => onFormSubmit(data))}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  autoFocus
                  variant="outlined"
                  id="email"
                  name="email"
                  label="Your email"
                  autoComplete="email"
                  inputRef={register}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  variant="outlined"
                  id="password"
                  name="password"
                  label="Password"
                  type="password"
                  autoComplete="current-password"
                  inputRef={register}
                />
              </Grid>
            </Grid>
            <Grid item container xs={12}>
              <Grid item xs={4} />
              <Grid item xs={4}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  color="primary"
                  className={classes.action}
                >
                  Login
                </Button>
              </Grid>
              <Grid item xs={4} />
            </Grid>
          </form>
        </div>
      </Box>
    </Container>
  );
};

export default LoginPage;

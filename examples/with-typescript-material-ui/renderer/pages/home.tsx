import React from 'react'
import { default as Button } from '@material-ui/core/Button'
import { default as Dialog } from '@material-ui/core/Dialog'
import { default as DialogTitle } from '@material-ui/core/DialogTitle'
import { default as DialogContent } from '@material-ui/core/DialogContent'
import { default as DialogContentText } from '@material-ui/core/DialogContentText'
import { default as DialogActions } from '@material-ui/core/DialogActions'
import { default as Typography } from '@material-ui/core/Typography'
import { withStyles, WithStyles, Theme, createStyles } from '@material-ui/core/styles'
import { resolve } from '../helpers'

const styles = ({ spacing }: Theme) => createStyles({
  root: {
    textAlign: 'center',
    paddingTop: spacing.unit * 4
  }
})

interface Props extends WithStyles<typeof styles> {}

const Home = withStyles(styles)(
  class extends React.Component<Props> {
    state = {
      open: false
    }

    handleClose = () => {
      this.setState({
        open: false
      })
    }

    handleClick = () => {
      this.setState({
        open: true
      })
    }

    render() {
      const { classes } = this.props
      const { open } = this.state

      return (
        <div className={classes.root}>
          <Dialog open={open} onClose={this.handleClose}>
            <DialogTitle>Super Secret Password</DialogTitle>
            <DialogContent>
              <DialogContentText>1-2-3-4-5</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={this.handleClose}>
                OK
              </Button>
            </DialogActions>
          </Dialog>
          <Typography variant="display1" gutterBottom>
            Material-UI
          </Typography>
          <Typography variant="subheading" gutterBottom>
            with Nextron
          </Typography>
          <img src={resolve('static/logo.png')} />
          <Typography gutterBottom>
            <a href={resolve('about')}>
              Go to the about page
            </a>
          </Typography>
          <Button variant="contained" color="secondary" onClick={this.handleClick}>
            Super Secret Password
          </Button>
        </div>
      )
    }
  }
)

export default Home

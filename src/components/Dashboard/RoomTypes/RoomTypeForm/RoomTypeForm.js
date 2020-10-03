import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'

const useStyles = () => {
  return {
    room_type_card: {
      width: '26em',
      marginTop: '1em',
      marginBottom: '1em',
    },
  }
}

class RoomTypeForm extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      roomId: this.props.roomId || null,
      roomNumber: this.props.roomNumber || '',
      roomType: this.props.roomType || '',
      isEmpty: this.props.isEmpty || 1,
    }
  }

  handleRoomNumberChange = (e) => {
    this.setState({ roomNumber: e.target.value })
  }

  handleRoomTypeChange = (e) => {
    this.setState({ roomType: e.target.value })
  }

  handleSubmit = () => {
    this.props.onFormSubmit({
      roomId: this.state.roomId,
      roomNumber: this.state.roomNumber,
      roomType: this.state.roomType,
      isEmpty: this.state.isEmpty,
    })
  }

  render() {
    const submitText = this.props.roomId ? 'Update' : 'Create'
    const { classes } = this.props

    return (
      <Card className={classes.room_type_card}>
        <CardContent>
          <div>
            <label>Room Type</label>
            <input
              type='text'
              value={this.state.roomType}
              onChange={this.handleRoomTypeChange}
            />
          </div>
          <div>
            <label>Room Quantity</label>
            <input
              type='text'
              value={this.state.roomNumber}
              onChange={this.handleRoomNumberChange}
            />
          </div>
        </CardContent>
        <CardActions>
          <Button
            variant="contained" color="primary"
            onClick={this.handleSubmit}
          >
            {submitText}
          </Button>
          <Button
            variant="contained" color="primary"
            onClick={this.props.onFormClose}
          >
            Cancel
          </Button>
        </CardActions>
      </Card>
    )
  }
}

export default withStyles(useStyles)(RoomTypeForm)
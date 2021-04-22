import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { Link, useHistory, useLocation } from "react-router-dom";
const useStyles = makeStyles({
  root: {
    width: 300,
    borderRadius: "10px",
  },
  media: {
    height: "140px",
    width: "140px",
  },
});

export default function MasterCard(props) {
  const classes = useStyles();

  return (
    <Card
      className={classes.root}
      justify="center"
      component={Link}
      to={props.link}
    >
      <CardActionArea>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "0.5rem",
          }}
        >
          <CardMedia
            className={classes.media}
            image={props.image}
            title={props.title}
          />
        </div>
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {props.title}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {props.description}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small" color="primary" component={Link} to={props.link}>
          GO
        </Button>
      </CardActions>
    </Card>
  );
}

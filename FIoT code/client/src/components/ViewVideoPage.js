import React from "react";
//import { Button } from "react-bootstrap";
import "../style/ViewVideo.css";
import {
  doc,
  getDoc,
 // updateDoc,
 // arrayUnion,
 // arrayRemove,
  onSnapshot,
 // increment,
} from "firebase/firestore";
import { db } from "../firebase";
import "reactjs-popup/dist/index.css";
var CryptoJS = require("crypto-js");

class ViewVideoPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
     // videoLink: props.videoLink,
      title: props.title,
      Dekey: "",
      currData: "You Don't Have Access for this IoT Data",
     // liked: false,
    //  subscribed: false,
    //  author: null,
   //   comment: "",
   //   comments: null,
   //   likes: 0,
    };
  }

  onIpchange = (event) => {
    this.setState({Dekey: event.target.value});
    console.log("DE", this.state.Dekey)
    console.log("co",this.props.currentData.description)
    var bytes = CryptoJS.AES.decrypt(this.props.currentData.description, this.state.Dekey);
    try{
      var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      console.log("thi",decryptedData);
      this.setState({currData: decryptedData});
    }
    catch (e){
      console.log("No data");
      this.setState({currData: "You Don't Have Access for this IoT Data"});
    }
  }
  async componentDidMount() {
    
    this.setState({ title: this.props.currentData.title });
    
   // const ciphertext = "U2FsdGVkX1+p1oZXEH+vSps/UVH/81MxCxYa5uMAFxAKBe/SPBs4iHxPMuzKUkFz";
  //  this.setState({ description: decryptedData});
   // console.log("ds", decryptedData);
    const userref = doc(
      db,
      "users",
      JSON.parse(window.localStorage.getItem("currentuser"))["address"] || "adarsh"
    );
    const userdata = await getDoc(userref);
    // console.log(this.state.liked);
    if (userdata.data()["likedVideos"]?.includes(this.props.currentData.id)) {
      this.setState({ liked: true });
    } else {
      this.setState({ liked: false });
    }
    if (
      userdata.data()["subscribed"]?.includes(this.props.currentData.creator)
    ) {
      this.setState({ subscribed: true });
    } else {
      this.setState({ subscribed: false });
    }

    // TODO : replace addres with this.props.currentvideo.creator
    const authorRef = doc(db, "users", "address");
    getDoc(authorRef).then((authorData) => {
      // console.log(authorData.data());
      this.setState({ author: authorData.data() });
    });

    // TODO : this.props.currentData.id OR this.props.currentData.id for live
    const videoRef = doc(db, "videos", this.props.currentData.id);
    onSnapshot(videoRef, (videoData) => {
      // console.log(authorData.data());
      
    });
  }
  // U2FsdGVkX1+p1oZXEH+vSps/UVH/81MxCxYa5uMAFxAKBe/SPBs4iHxPMuzKUkFz
  render() {
   
    // console.log(this.state.author);
   // const { onRouteChange } = this.props;
    return (
      <>
        <div className="allVideoButton">
          <button
            onClick={() => this.props.onRouteChange("home")}
            className="ViewVideo_All_Button"
          >
            All Available Data
          </button>
        </div>
        <div className="ViewVideo">
          <div className="ViewVideo_left">
          <div className="ViewVideo_title">{this.state.title}</div>
          <div className="ViewVideo_description">
       <pre>{ JSON.parse(JSON.stringify(this.state.currData))}</pre>  
        
            </div>
            <label>Paste the Decryption Key To Access: </label>    
            <input onChange={this.onIpchange}/>
          </div>
        </div>
      </>
    );
  }
}

export default ViewVideoPage;

import React, { Component } from "react";
import VideoCard from "./VideoCard";
import "../style/Home.css";
import ViewVideoPage from "./ViewVideoPage";
import loader from "../assets/loader.gif";
import playlist from "../contracts/playlist.json";

//*******************************************************
// NOTES:
//    - Smart contract address for 'playlist' contract required here!
//    - Search bar does not actually work (also decide whether it should redirect to new page or filter)
//    - Render uploaded videos left to right
//    - Intelligently render new, uploaded videos without having to reload the page

/*
The code below connects to Rinkeby Ethereum network via Infura node and creates a contract object for 'playlist' contract
*/
const Web3 = require("web3");
const web3 = new Web3(
  new Web3.providers.HttpProvider(
    "https://rinkeby.infura.io/v3/fb5fe481ea6342b8b40578e5a3150138"
  )
);

const contractAddress = "0x42F155ca7452d76d6BcB4a6DcAB1dAE806D7f861";

const contract = new web3.eth.Contract(playlist, contractAddress);
// console.log(contract)
//*******************************************************

/*********************************************************
Function below handles asynchronous function calls to, in this case, 'playlist' contract
*/

async function rpc(func) {
  while (true) {
    try {
      return await func.call();
    } catch (error) {
      if (!error.message.startsWith("Invalid JSON RPC response")) throw error;
    }
  }
}

class Home extends Component {
  constructor() {
    super();
    this.state = {
      route: "home", // handles and captures routing state. Begin at sign in form
      dataLink: "",
      currentData: null
    };
  }

  onRouteChange = (route) => {
    this.setState({ route: route });
  };
  onDataView = (dataLink, obj) => {
    this.setState({ dataLink: dataLink });
    this.setState({ currentData: obj });
  };
  componentDidMount() {
    this.createData(); // retrieve data thumbnails and titles after DOM has rendered
    //this.getStreams()
  }

  createData = async () => {
    let data = [];
    var title;
    //var thumbnailHash;
   // var thumbnailLink;
  //  var videoHash;
   // var videoLink;
    var result;
    var stringex;
    var length = await rpc(contract.methods.getArrayLength()); // get number of data uploaded to website
    result = await rpc(contract.methods.getAllData());
    // console.log(result);
    // console.log(length);
    for (var i = 0; i < length; i++) {
      result = await rpc(contract.methods.getData(i));
      // console.log(result);// contract function returns a string containing video title, thumbnail hash, and video hash
      // result = result.split("/");
      title = result.title;
      //thumbnailHash = result.thumbnailHash;
     // videoHash = result.videoHash;
      stringex = "https://ipfs.io/ipfs/";
    //  thumbnailLink = stringex.concat(thumbnailHash); // construct link to thumbnail that users can navigate to
     // videoLink = stringex.concat(videoHash); // construct link to video that users can navigate to
      // console.log(videoLink,thumbnailLink);
      data.push(
        <VideoCard
          key={i}
          onRouteChange={this.onRouteChange}
        onDataView={this.onDataView}
         // imglink={thumbnailLink}
          title={title}
        //  videoLink={videoLink}
          dataObj={result}
        />
      );
    }
    this.setState({
      Data: data,
    });
    console.log("Hello",data)
  };

  // getStreams = () => {
  //     // /api/stream?streamsonly=1&filters=[{"id": "isActive", "value": true}]  //for active streamssss
  //     const apiKey = 'ced26452-f2bd-4173-a0bc-93b4c19628c0'
  //     const headers = {
  //       "content-type": "application/json",
  //       Authorization: `Bearer ${apiKey}`,
  //       'Target-URL':`https://livepeer.com/api/stream?streamsonly=1`
  //     };
  //     axios
  //     .get(`https://streamzy-proxy.herokuapp.com/`, { headers })
  //     .then(result=>{
  //       console.log(result.data);
  //         var streams = [];
  //         if(result.data.length>0){
  //           for(var i=0; i<result.data.length; i++){
  //             const videoLink = `https://cdn.livepeer.com/hls/${result.data[i].playbackId}/index.m3u8`
  //             streams.push(
  //               <VideoCard
  //               key={i}
  //               onRouteChange={this.onRouteChange}
  //               onVideoView={this.onVideoView}
  //               imglink={'stream'}
  //               title={result.data[i].name}
  //               videoLink={videoLink}
  //               videoObj={result.data[i]}
  //               stream={true}
  //             />
  //             )
  //           }
  //           this.setState({ourStreams:streams})
  //         }
  //       }
  //     )
  // }

  render() {
    return (
      <>
        {this.state.route !== "view" ? (
          <div className="home">
            {/* {
              this.state.ourStreams && this.state.ourStreams
            } */}
            {this.state.Data ? (
              this.state.Data
            ) : (
              <div className="loaderHome">
                <img src={loader} alt="Loading.." />
              </div>
            )}
          </div>
        ) : (
          <ViewVideoPage
            onRouteChange={this.onRouteChange}
            currentData={this.state.currentData}
           // videoLink={this.state.videoLink}
          />
        )}
      </>
    );
  }
}

export default Home;

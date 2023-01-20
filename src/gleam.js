import React from 'react';
import './RunGleam.css';
import { Helmet } from 'react-helmet';

function RunGleam() {
  return (
    <React.Fragment>
      <Helmet>
        <meta charset="utf-8" />
        <title>#StarGardenFirstLook Competition</title>
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, user-scalable=0" />
        <meta property="og:url" content="https://gleam.io/WSbRo/stargardenfirstlook-competition" />
        <meta property="og:title" content="Welcome to the StarGarden Competition, Enter To Win! " />
        <meta property="og:image" content="https://user-assets.out.sh/user-assets/2035763/rGa0Bz4ONhPITW9w/give-away.jpg" />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:image:src" content="https://user-assets.out.sh/user-assets/2066728/mUnAvKzcyosrXkg6/give-away.jpg" />
        <meta property="fb:app_id" content="152351391599356" />
        <meta property="og:description" content="In celebration of our StarGarden: First Look video coming out, we're launching a competition with industry-leading projects where you can enter to win a bundle of NFTs, including a StarGarden for first place!    Simply follow the steps below to enter by February 3rd. Three lucky winners will be randomly selected and announced on February 6th on Discord &amp; Twitter.        There are a ton of different ways to enter, so have fun &amp; remember, Only Together We Transcend!" />
      </Helmet>
      
      <div className="run-gleam">
        <iframe src="https://gleam.io/WSbRo/stargardenfirstlook-competition" allowFullScreen />
      </div>
    </React.Fragment>
  );
}

export default RunGleam;
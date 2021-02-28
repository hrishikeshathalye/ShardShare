import React from "react";

function Content() {
    return (
        <div>
            <div className="container content">
                <div className="row">
                    <div className="col-sm-4 talk">
                        <h1>ShardShare</h1>
                        <br />
                        <h6 className="bold-four">
                            ShardShare is the best way to share a secret credential among people you trust. <br />
                            Use our app to ensure that no one is locked out of a resource only you have access to even when you are not available, 
                            while also protecting unauthorized access!
                    </h6>
                        <br />
                        <h6><a className="btn btn-dark start start-two" href="#">View Documentation</a></h6> <br />
                        <h6><a className="btn btn-dark start start-two" href="#">GitHub <i class="fab fa-github"></i></a></h6>
                    </div>
                    <div className="col-sm-3 showcase-img">
                        {/* <div className="circle"></div> */}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Content;
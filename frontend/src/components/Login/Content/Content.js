import React from "react";

function Content() {
    return (
        <div>
            <div className="container content">
                <div className="row">
                    <div className="col-sm-5 talk">
                        <h1>ShardShare</h1>
                        <br />
                        <h6 className="bold-four">
                            ShardShare is the best way to share a secret credential among people you trust. <br />
                            Our application helps you ensure that no one is locked out of a resource only you have access to even when you are not available, 
                            while also protecting against unauthorized access!
                        </h6>
                        <br />
                        <h6><a className="btn btn-dark start start-two" href="#">View Documentation</a></h6> <br />
                        <h6><a className="btn btn-dark start start-two" href="#">GitHub <i class="fab fa-github"></i></a></h6> <br />
                    </div>
                    <div className="col-sm-3 talk">
                    </div>
                    <div className="col-sm-4 showcase-img">
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Content;
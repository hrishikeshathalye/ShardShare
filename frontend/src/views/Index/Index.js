import React, { Component } from "react"
import Header from '../../components/Login/Header/Header';
import Content from './Content';
import Footer from '../../components/Login/Footer/Footer';

class Index extends Component {
    render() {
        return (
            <div class="main-container">
                <Header />
                <Content />
                <Footer />
            </div>
        )
    }
}

export default Index;
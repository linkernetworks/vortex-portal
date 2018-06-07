import * as React from 'react';
import './App.css';

import { Layout } from 'antd';
import SiderMenu from '@/components/SiderMenu';

// import Hello from '../../containers/HelloContainer';
import logo from '@/assets/logo.svg';

const { Content, Header, Footer } = Layout;

class App extends React.Component {
  public render() {
    return (
      <div className="App">
        <Layout>
          <SiderMenu logo={logo} name={'Vortex'} />
          <Layout>
            <Header style={{ background: '#fff', padding: 0 }}>header</Header>
            <Content style={{ margin: '24px 24px 0', height: '100%' }}>
              main content <br />
              main content <br />
              main content <br />
            </Content>
            <Footer>footer</Footer>
          </Layout>
        </Layout>
      </div>
    );
  }
}

export default App;

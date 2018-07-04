import * as React from 'react';
import { Icon } from 'antd';
import Particles from 'react-particles-js';

import * as styles from './styles.module.scss';

const particlesParams = {
  particles: {
    number: {
      value: 32,
      density: {
        enable: true,
        value_area: 1480
      }
    },
    color: {
      value: '#E8ECF0'
    },
    size: {
      value: 3,
      random: true
    },
    line_linked: {
      enable: true,
      distance: 150,
      color: '#EAEEF2',
      opacity: 0.4,
      width: 1
    },
    move: {
      enable: true,
      out_mode: 'out',
      speed: 2.8
    }
  },
  interactivity: {
    events: {
      onhover: {
        enable: false
      },
      onclick: {
        enable: false
      }
    }
  },
  retina_detect: true
};

class UserLayout extends React.Component<object, object> {
  public shouldComponentUpdate() {
    return false;
  }

  public render() {
    return (
      <div className={styles.container}>
        <Particles className={styles.background} params={particlesParams} />
        <section className={styles.content}>{this.props.children}</section>
        <section className={styles.footer}>
          <span>
            Copyright <Icon type="copyright" /> 2018 Linker Networks. All right
            reserved
          </span>
        </section>
      </div>
    );
  }
}

export default UserLayout;

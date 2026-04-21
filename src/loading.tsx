import { Skeleton } from 'antd';
import styles from './loading.less';

const Loading: React.FC = () => (
  <Skeleton className={styles.loadingSkeleton} active />
);

export default Loading;

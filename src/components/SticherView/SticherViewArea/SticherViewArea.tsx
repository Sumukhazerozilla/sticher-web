import useSticherStore from '../../../store/sticherStore';
import { BASE_URL } from '../../constants';
import { SticherHeaderIdTypes } from '../utils';

interface SticherViewAreaProps {
  activeHeaderOption: SticherHeaderIdTypes | null;
}

const SticherViewArea: React.FC<SticherViewAreaProps> = () => {
  const activeImageIndex = useSticherStore((state) => state.activeImageIndex);
  const slideData = useSticherStore((state) => state.slideData);

  return (
    <figure className="bg-white boxShadow h-[81vh] mt-3 rounded-xl overflow-hidden">
      <img src={`${BASE_URL}${slideData[activeImageIndex === -1 ? 0 : activeImageIndex]?.image}`} alt={slideData[activeImageIndex]?.text} />
    </figure>
  );
};

export default SticherViewArea;

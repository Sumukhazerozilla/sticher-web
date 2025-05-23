import { FaMinus } from 'react-icons/fa';
import useSticherStore from '../../../store/sticherStore';
import { palette } from '../../../utils/palette';
import { BASE_URL } from '../../constants';
import TextField from './TextField';

const SticherViewAside = () => {
  const slideData = useSticherStore((state) => state.slideData);
  const activeImageIndex = useSticherStore((state) => state.activeImageIndex);
  const setActiveImageIndex = useSticherStore((state) => state.setActiveImageIndex);
  const editSlideText = useSticherStore((state) => state.editSlideText);
  const selectAllScreens = useSticherStore((state) => state.selectAll);
  const setSelectAllScreens = useSticherStore((state) => state.setSelectAll);

  return (
    <aside className="h-[95vh] bg-white boxShadow rounded-xl  overflow-hidden">
      <div className="p-4">
        <div className="flex items-center">
          <div className="relative">
            <input type="checkbox" id="selectAll" checked={selectAllScreens} onChange={(e) => setSelectAllScreens(e.target.checked)} className="sr-only" />
            <div
              className={`w-5 h-5 border rounded cursor-pointer flex items-center justify-center `}
              style={{ borderColor: selectAllScreens ? palette.primary : '#D9D9D9', backgroundColor: selectAllScreens ? palette.primary : 'white' }}
            >
              {selectAllScreens && <FaMinus size={10} color="white" />}
            </div>
          </div>
          <label htmlFor="selectAll" className="ml-3 cursor-pointer text-xs font-semibold">
            Select Screens(s)
          </label>
        </div>
      </div>

      <div className="flex flex-col gap-4 px-3 overflow-y-auto h-[80vh]">
        {slideData?.map((slide, index) => {
          return (
            <div
              onClick={() => setActiveImageIndex(index)}
              key={slide?.id}
              className="border rounded-lg cursor-pointer p-3"
              style={{
                backgroundColor: activeImageIndex === index || selectAllScreens ? '#E6F4FF' : '',
                borderColor: activeImageIndex === index || selectAllScreens ? palette.primary : '#D9D9D9',
              }}
            >
              <img src={`${BASE_URL}${slide?.image}`} alt={slide?.text} className="object-cover w-full h-[90px] rounded-lg" />
              <div className="mt-2 pt-1">
                <div className="flex items-center gap-1 text-xs font-semibold">
                  <div className="rounded-full h-5 w-5 flex items-center justify-center text-white" style={{ backgroundColor: palette.primary }}>
                    {index + 1}
                  </div>
                  <h4 style={{ color: 'rgba(0, 0, 0, 0.45)' }}>{new Date(slide?.timeStamp).toLocaleTimeString()}</h4>
                </div>
                <TextField slide={slide} editSlideText={editSlideText} />
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
};

export default SticherViewAside;

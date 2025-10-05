
import Skeleton, {SkeletonTheme} from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default () => {
    const SkeletonCard = () => (
        <div className="md:w-[260px] w-full p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl">
            <div className="flex justify-between items-center mb-2">
                <Skeleton width={120} height={24} />
                <Skeleton circle width={24} height={24} />
            </div>
            <Skeleton count={2} />
            <div className="mt-2">
                <Skeleton width={80} /> 
            </div>
        </div>
    );

    return (
            <SkeletonTheme baseColor="#3B82F6" highlightColor="#60A5FA">
                    <div className='flex flex-col h-screen overflow-hidden bg-gray-50 dark:bg-gray-900'>
                        {/* Navbar Skeleton */}
                        <div className="p-2 pr-4 h-[58px] border-b-2 border-gray-200 dark:border-gray-700 flex justify-between items-center">
                            <Skeleton width={100} height={25} />
                            <div className="flex items-center gap-2">
                                <Skeleton width={200} height={38} borderRadius={12} />
                                <Skeleton circle width={35} height={35} />
                                <Skeleton circle width={35} height={35} />
                            </div>
                        </div>
                        <div className='flex h-full'>
                            {/* Sidebar Skeleton */}
                            <div className='hidden md:flex flex-col w-[250px] p-3 pl-6 border-r-2 border-gray-200 dark:border-gray-700'>
                                <Skeleton height={38} borderRadius={6} className="!mb-5" />
                                <Skeleton count={5} height={30} className="!mb-2" />
                            </div>
                            {/* Main Content Skeleton */}
                            <div className='flex flex-col w-full h-full overflow-auto'>
                                <div id="Header" className="flex items-center w-full h-20 p-4 border-b-2 border-gray-200 dark:border-gray-700">
                                    <div className="flex-1">
                                        <Skeleton width={150} height={24} />
                                        <Skeleton width={80} />
                                    </div>
                                    <Skeleton width={120} height={40} borderRadius={12} />
                                </div>
                                <div className="p-3 flex flex-1 flex-wrap justify-center md:justify-start content-start items-start gap-2">
                                    {Array(8).fill(0).map((_, i) => <SkeletonCard key={i} />)}
                                </div>
                            </div>
                        </div>
                    </div>
                </SkeletonTheme>
    )
}
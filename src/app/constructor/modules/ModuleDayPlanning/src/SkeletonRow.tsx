import Skeleton from "react-loading-skeleton"

const SkeletonRow: React.FC = props => {
    return <div className="moduleDayPlanning_skeletonRow">
    <div className="moduleDayPlanning_skeletonRowBody">
        <Skeleton className="skeleton" height={32} width={125} />
        <Skeleton className="skeleton" height={20} width={210} />
        <div>
            <Skeleton className="skeleton" height={19} width={400} />
        </div>
    </div>
    <div className="moduleDayPlanning_skeletonRowButton">
    <Skeleton className="skeleton" height={34} width={34} />
    </div>
</div>
}

export default SkeletonRow
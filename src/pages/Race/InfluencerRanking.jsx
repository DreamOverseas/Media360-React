import { useEffect, useState } from "react";
import "./InfluencerRanking.css";

// 模拟网红数据
const mockData = [
  { id: 1, name: "Alice", avatar: "/avatars/1.png", score: 120 },
  { id: 2, name: "Bob", avatar: "/avatars/2.png", score: 110 },
  { id: 3, name: "Cathy", avatar: "/avatars/3.png", score: 105 },
  { id: 4, name: "David", avatar: "/avatars/4.png", score: 100 },
  { id: 5, name: "Eva", avatar: "/avatars/5.png", score: 98 },
  { id: 6, name: "Frank", avatar: "/avatars/6.png", score: 95 },
  { id: 7, name: "Grace", avatar: "/avatars/7.png", score: 93 },
  { id: 8, name: "Helen", avatar: "/avatars/8.png", score: 90 },
  { id: 9, name: "Ivan", avatar: "/avatars/9.png", score: 88 },
  { id: 10, name: "Jack", avatar: "/avatars/10.png", score: 85 },
  { id: 11, name: "Kim", avatar: "/avatars/11.png", score: 80 },
  { id: 12, name: "Leo", avatar: "/avatars/12.png", score: 75 },
  // ...更多数据
];

const fetchInfluencerData = async () => {
  // 这里可以替换为真实接口
  return mockData;
};

const InfluencerRanking = () => {
  const [influencers, setInfluencers] = useState([]);

  // 模拟实时数据变化
  useEffect(() => {
    let timer = setInterval(async () => {
      // 模拟分数变化
      const updated = (await fetchInfluencerData()).map(item => ({
        ...item,
        score: item.score + Math.floor(Math.random() * 3 - 1), // 随机变化
      }));
      // 按分数排序
      updated.sort((a, b) => b.score - a.score);
      setInfluencers(updated);
    }, 2000);

    // 首次加载
    fetchInfluencerData().then(data => {
      data.sort((a, b) => b.score - a.score);
      setInfluencers(data);
    });

    return () => clearInterval(timer);
  }, []);
  console.log("组件已加载");
  const top10 = influencers.slice(0, 10);
  const others = influencers.slice(10);

  return (
    <div className='influencer-ranking-container'>
      <h2>网红比赛动态排名</h2>
      <div className='circle-ranking'>
        {top10.map((inf, idx) => {
          // 让第一名在正上方
          const angle = -90 + (360 / top10.length) * idx;
          const rad = (angle * Math.PI) / 180;
          const radius = 120;
          const centerX = 140,
            centerY = 140;
          const x = centerX + radius * Math.cos(rad) - 30;
          const y = centerY + radius * Math.sin(rad) - 30;
          return (
            <div
              key={inf.id}
              className='circle-item'
              style={{
                left: `${x}px`,
                top: `${y}px`,
              }}
            >
              <img src={inf.avatar} alt={inf.name} className='circle-avatar' />
              <div className='circle-name'>{inf.name}</div>
              <div className='circle-score'>{inf.score}</div>
              <div className='circle-rank'>{idx + 1}</div>
            </div>
          );
        })}
        <div className='circle-center'>TOP 10</div>
      </div>
      <div className='other-ranking'>
        <h3>其他网红</h3>
        <ul>
          {others.map((inf, idx) => (
            <li key={inf.id} className='other-item'>
              <span className='other-rank'>{idx + 11}</span>
              <img src={inf.avatar} alt={inf.name} className='other-avatar' />
              <span className='other-name'>{inf.name}</span>
              <span className='other-score'>{inf.score}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default InfluencerRanking;

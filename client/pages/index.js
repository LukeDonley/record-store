import Link from 'next/link';

const LandingPage = ({ currentUser, records }) => {
  const recordList = records.map((record) => {
    return (
      <tr key={record.id}>
        <td>{record.title}</td>
        <td>{record.price}</td>
        <td>
          <Link href='/records/[recordId]' as={`/records/${record.id}`}>
            <a>View</a>
          </Link>
        </td>
      </tr>
    );
  });

  return (
    <div>
      <h1>Tickets</h1>
      <table className='table'>
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>{recordList}</tbody>
      </table>
    </div>
  );
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get('/api/records');

  return { records: data };
};

export default LandingPage;

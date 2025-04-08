


const TestPage = async ({ searchParams }: { searchParams: Promise<{ id: string, userName: string }> }) => {
  const { id, userName } = await searchParams;
  return (
    <div>
      <h1>Test Page</h1>
      <p>Received ID: {id}</p>
      <p>Received name: {userName}</p>
    </div>
  );
};

export default TestPage;

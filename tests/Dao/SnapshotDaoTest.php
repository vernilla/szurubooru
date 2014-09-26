<?php
namespace Szurubooru\Tests\Dao;

class SnapshotDaoTest extends \Szurubooru\Tests\AbstractDatabaseTestCase
{
	public function setUp()
	{
		parent::setUp();
		$this->userDaoMock = $this->mock(\Szurubooru\Dao\UserDao::class);
	}

	public function testSaving()
	{
		$snapshot = $this->getTestSnapshot();
		$snapshotDao = $this->getSnapshotDao();
		$snapshotDao->save($snapshot);
		$this->assertNotNull($snapshot->getId());
		$this->assertEntitiesEqual($snapshot, $snapshotDao->findById($snapshot->getId()));
	}

	public function testUserLazyLoader()
	{
		$snapshot = $this->getTestSnapshot();
		$snapshot->setUser(new \Szurubooru\Entities\User(5));
		$this->assertEquals(5, $snapshot->getUserId());
		$snapshotDao = $this->getSnapshotDao();
		$snapshotDao->save($snapshot);
		$savedSnapshot = $snapshotDao->findById($snapshot->getId());
		$this->assertEquals(5, $savedSnapshot->getUserId());

		$this->userDaoMock
			->expects($this->once())
			->method('findById');
		$savedSnapshot->getUser();
	}

	private function getTestSnapshot()
	{
		$snapshot = new \Szurubooru\Entities\Snapshot();
		$snapshot->setType(\Szurubooru\Entities\Snapshot::TYPE_POST);
		$snapshot->setData(['wake up', 'neo', ['follow' => 'white rabbit']]);
		$snapshot->setPrimaryKey(1);
		$snapshot->setTime('whateveer');
		$snapshot->setUserId(null);
		$snapshot->setOperation(\Szurubooru\Entities\Snapshot::OPERATION_CHANGE);
		return $snapshot;
	}

	private function getSnapshotDao()
	{
		return new \Szurubooru\Dao\SnapshotDao(
			$this->databaseConnection,
			$this->userDaoMock);
	}
}

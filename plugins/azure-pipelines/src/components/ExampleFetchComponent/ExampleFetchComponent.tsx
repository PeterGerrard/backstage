import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Table, TableColumn, Progress } from '@backstage/core-components';
import Alert from '@material-ui/lab/Alert';
import { useAsync } from 'react-use';

const useStyles = makeStyles({
  avatar: {
    height: 32,
    width: 32,
    borderRadius: '50%',
  },
});

type User = {
  gender: string; // "male"
  name: {
    title: string; // "Mr",
    first: string; // "Duane",
    last: string; // "Reed"
  };
  location: object; // {street: {number: 5060, name: "Hickory Creek Dr"}, city: "Albany", state: "New South Wales",…}
  email: string; // "duane.reed@example.com"
  login: object; // {uuid: "4b785022-9a23-4ab9-8a23-cb3fb43969a9", username: "blackdog796", password: "patch",…}
  dob: object; // {date: "1983-06-22T12:30:23.016Z", age: 37}
  registered: object; // {date: "2006-06-13T18:48:28.037Z", age: 14}
  phone: string; // "07-2154-5651"
  cell: string; // "0405-592-879"
  id: {
    name: string; // "TFN",
    value: string; // "796260432"
  };
  picture: { medium: string }; // {medium: "https://randomuser.me/api/portraits/men/95.jpg",…}
  nat: string; // "AU"
};

type DenseTableProps = {
  users: User[];
};

export const DenseTable = ({ users }: DenseTableProps) => {
  const classes = useStyles();

  const columns: TableColumn[] = [
    { title: 'Avatar', field: 'avatar' },
    { title: 'Name', field: 'name' },
    { title: 'Email', field: 'email' },
    { title: 'Nationality', field: 'nationality' },
  ];

  const data = users.map(user => {
    return {
      avatar: (
        <img
          src={user.picture.medium}
          className={classes.avatar}
          alt={user.name.first}
        />
      ),
      name: `${user.name.first} ${user.name.last}`,
      email: user.email,
      nationality: user.nat,
    };
  });

  return (
    <Table
      title="Example User List (fetching data from randomuser.me)"
      options={{ search: false, paging: false }}
      columns={columns}
      data={data}
    />
  );
};

type Links = {
  self: {
    href: string;
  };
  web: {
    href: string;
  };
  'pipeline.web': {
    href: string;
  };
  pipeline: {
    href: string;
  };
};

interface Pipeline {
  url: string;
  id: number;
  revision: number;
  name: string;
  folder: string;
}

interface PipelineValue {
  _links: Links;
  pipeline: Pipeline;
  state: string;
  result: string;
  createdDate: Date;
  finishedDate: Date;
  url: string;
  id: number;
  name: string;
}

interface PipelineList {
  count: number;
  value: PipelineValue[];
}

export const ExampleFetchComponent = () => {
  const [runUrls, setRunUrls] = useState<string[]>();
  const { value, loading, error } = useAsync(async (): Promise<
    PipelineValue[]
  > => {
    const response = await fetch(
      'https://dev.azure.com/red-gate/platform/_apis/pipelines/27/runs?api-version=6.1-preview.1',
      {
        headers: [['Authorization', 'Basic ']],
      },
    );
    const data = (await response.json()) as PipelineList;
    return data.value;
  }, []);
  useEffect(() => {
    if (value) {
      setRunUrls(value.map(p => p.url));
    }
  }, [value]);
  const pipelineResult = useAsync(async (): Promise<string | undefined> => {
    if (runUrls && runUrls.length > 0) {
      const response = await fetch(runUrls[0], {
        headers: [['Authorization', 'Basic ']],
      });
      const data = (await response.json()) as any;
      if (
        (data.resources.repositories.self.refName as string).endsWith(
          'refs/heads/main',
        )
      ) {
        return data.result;
      }

      setRunUrls(r => r?.slice(1));
      return undefined;
    }

    return undefined;
  }, [runUrls]);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }
  if (pipelineResult.loading || pipelineResult.value === undefined) {
    return <Progress />;
  } else if (pipelineResult.error) {
    return <Alert severity="error">{pipelineResult.error.message}</Alert>;
  }

  return JSON.stringify(pipelineResult.value);
};

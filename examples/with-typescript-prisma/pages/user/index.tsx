import { User } from "@prisma/client";
import { GetStaticProps } from "next";
import Link from "next/link";
import Layout from "../../components/Layout";
import UserView from "../../components/User";
import prisma from "../../utils/prisma";

type Props = {
  user: User;
};

const WithStaticProps = ({ user }: Props) => (
  <Layout title="Users List | Next.js + TypeScript Example">
    <UserView user={user} />
    <p>
      <Link href="/">
        <a>Go home</a>
      </Link>
    </p>
  </Layout>
);

export const getStaticProps: GetStaticProps = async () => {
  // Example for including static props in a Next.js function component page.
  // Don't forget to include the respective types for any props passed into
  // the component.
  const user = await prisma.user.findFirst();
  return { props: { user } };
};

export default WithStaticProps;

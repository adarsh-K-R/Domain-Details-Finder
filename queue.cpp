// implement queue using linked list with isempty and front functions

#include <iostream>
#include <string>
#include <cstdlib>
#include <ctime>
using namespace std;

struct node
{
    int data;
    node *next;
};

class queue
{
private:
    node *front;
    node *rear;

public:
    queue()
    {
        front = NULL;
        rear = NULL;
    }

    void enqueue(int x)
    {
        node *temp = new node;
        temp->data = x;
        temp->next = NULL;

        if (front == NULL && rear == NULL)
        {
            front = temp;
            rear = temp;
            return;
        }

        rear->next = temp;
        rear = temp;
    }

    void dequeue()
    {
        node *temp = front;
        if (front == NULL)
        {
            cout << "Queue is empty" << endl;
            return;
        }

        if (front == rear)
        {
            front = NULL;
            rear = NULL;
        }
        else
        {
            front = front->next;
        }

        delete temp;
    }

    int Front()
    {
        if (front == NULL)
        {
            cout << "Queue is empty" << endl;
            return 0;
        }
        return front->data;
    }

    bool isempty()
    {
        if (front == NULL)
        {
            return true;
        }
        else
        {
            return false;
        }
    }
};

int main()
{
    srand(time(NULL));
    queue q;
    int n = 10;
    for (int i = 0; i < n; i++)
    {
        q.enqueue(rand() % 100);
    }

    while (!q.isempty())
    {
        cout << q.Front() << " ";
        q.dequeue();
    }
    cout << endl;
    return 0;
}